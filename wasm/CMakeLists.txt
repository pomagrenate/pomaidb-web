cmake_minimum_required(VERSION 3.16)
project(pomaidb_wasm CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(pomaidb_wasm bindings/pomaidb_bindings.cpp)

if(EMSCRIPTEN)
  target_compile_options(pomaidb_wasm PRIVATE -O3)
  target_link_options(
    pomaidb_wasm
    PRIVATE
    -O3
    -sMODULARIZE=1
    -sEXPORT_ES6=1
    -sALLOW_MEMORY_GROWTH=1
    -sENVIRONMENT=web,worker,node
    -sEXPORTED_FUNCTIONS=[_pomaidb_init,_pomaidb_create_db,_pomaidb_free_db,_pomaidb_upsert_batch,_pomaidb_search,_pomaidb_set_param,_pomaidb_stats_json,_pomaidb_free_string,_malloc,_free]
    -sEXPORTED_RUNTIME_METHODS=[cwrap,UTF8ToString,stringToUTF8]
  )
endif()
