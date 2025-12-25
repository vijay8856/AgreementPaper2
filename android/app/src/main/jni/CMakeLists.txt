cmake_minimum_required(VERSION 3.22.1)
project(NitroModules)

add_library(nitro SHARED
        cpp-adapter.cpp
)

target_compile_options(nitro PRIVATE -std=c++17)

find_package(react-native REQUIRED CONFIG)
target_link_libraries(nitro reactnative::reactnative)
