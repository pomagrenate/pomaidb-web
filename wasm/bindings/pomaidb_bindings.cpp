#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstdlib>
#include <cstring>
#include <limits>
#include <mutex>
#include <string>
#include <unordered_map>
#include <vector>

#include <emscripten/emscripten.h>

namespace {
struct PomaiDbLite {
  int32_t dim = 0;
  float approx_ratio = 1.0f;
  std::vector<int32_t> ids;
  std::vector<float> vectors;
  std::unordered_map<int32_t, size_t> id_to_index;
  std::mutex mutex;
};

float l2_distance(const float* a, const float* b, int32_t dim) {
  float sum = 0.0f;
  for (int32_t i = 0; i < dim; ++i) {
    float diff = a[i] - b[i];
    sum += diff * diff;
  }
  return sum;
}

std::string stats_json(const PomaiDbLite* db) {
  std::string json = "{";
  json += "\"dim\":" + std::to_string(db->dim) + ",";
  json += "\"count\":" + std::to_string(db->ids.size()) + ",";
  json += "\"approx_ratio\":" + std::to_string(db->approx_ratio);
  json += "}";
  return json;
}
}  // namespace

extern "C" {

EMSCRIPTEN_KEEPALIVE
void pomaidb_init() {}

EMSCRIPTEN_KEEPALIVE
uintptr_t pomaidb_create_db(int32_t dim) {
  if (dim <= 0) {
    return 0;
  }
  auto* db = new PomaiDbLite();
  db->dim = dim;
  return reinterpret_cast<uintptr_t>(db);
}

EMSCRIPTEN_KEEPALIVE
void pomaidb_free_db(uintptr_t handle) {
  auto* db = reinterpret_cast<PomaiDbLite*>(handle);
  delete db;
}

EMSCRIPTEN_KEEPALIVE
int32_t pomaidb_upsert_batch(uintptr_t handle, const int32_t* ids_ptr, const float* vec_ptr, int32_t n, int32_t dim) {
  auto* db = reinterpret_cast<PomaiDbLite*>(handle);
  if (!db || !ids_ptr || !vec_ptr || n <= 0 || dim != db->dim) {
    return -1;
  }
  std::lock_guard<std::mutex> lock(db->mutex);
  for (int32_t i = 0; i < n; ++i) {
    int32_t id = ids_ptr[i];
    const float* vec = vec_ptr + static_cast<int64_t>(i) * dim;
    auto found = db->id_to_index.find(id);
    if (found == db->id_to_index.end()) {
      size_t index = db->ids.size();
      db->ids.push_back(id);
      db->vectors.insert(db->vectors.end(), vec, vec + dim);
      db->id_to_index.emplace(id, index);
    } else {
      size_t index = found->second;
      std::copy(vec, vec + dim, db->vectors.begin() + static_cast<int64_t>(index) * dim);
    }
  }
  return 0;
}

EMSCRIPTEN_KEEPALIVE
int32_t pomaidb_search(uintptr_t handle, const float* query_ptr, int32_t topk, int32_t* out_ids_ptr, float* out_scores_ptr) {
  auto* db = reinterpret_cast<PomaiDbLite*>(handle);
  if (!db || !query_ptr || !out_ids_ptr || !out_scores_ptr || topk <= 0) {
    return -1;
  }
  std::lock_guard<std::mutex> lock(db->mutex);
  const size_t total = db->ids.size();
  if (total == 0) {
    return 0;
  }
  size_t limit = static_cast<size_t>(std::ceil(total * db->approx_ratio));
  limit = std::max<size_t>(1, std::min(limit, total));

  struct Candidate {
    int32_t id;
    float score;
  };

  std::vector<Candidate> candidates;
  candidates.reserve(limit);
  for (size_t i = 0; i < limit; ++i) {
    const float* vec = db->vectors.data() + static_cast<int64_t>(i) * db->dim;
    float score = l2_distance(query_ptr, vec, db->dim);
    candidates.push_back({db->ids[i], score});
  }

  const int32_t found = static_cast<int32_t>(std::min<size_t>(topk, candidates.size()));
  std::partial_sort(candidates.begin(), candidates.begin() + found, candidates.end(),
                    [](const Candidate& a, const Candidate& b) { return a.score < b.score; });

  for (int32_t i = 0; i < found; ++i) {
    out_ids_ptr[i] = candidates[i].id;
    out_scores_ptr[i] = candidates[i].score;
  }
  return found;
}

EMSCRIPTEN_KEEPALIVE
int32_t pomaidb_set_param(uintptr_t handle, const char* key, float value) {
  auto* db = reinterpret_cast<PomaiDbLite*>(handle);
  if (!db || !key) {
    return -1;
  }
  std::string key_str(key);
  if (key_str == "approx_ratio") {
    float clamped = std::max(0.05f, std::min(value, 1.0f));
    db->approx_ratio = clamped;
    return 0;
  }
  return -2;
}

EMSCRIPTEN_KEEPALIVE
char* pomaidb_stats_json(uintptr_t handle) {
  auto* db = reinterpret_cast<PomaiDbLite*>(handle);
  if (!db) {
    return nullptr;
  }
  std::string json = stats_json(db);
  char* buffer = static_cast<char*>(std::malloc(json.size() + 1));
  if (!buffer) {
    return nullptr;
  }
  std::memcpy(buffer, json.c_str(), json.size() + 1);
  return buffer;
}

EMSCRIPTEN_KEEPALIVE
void pomaidb_free_string(char* ptr) {
  std::free(ptr);
}

}  // extern "C"
