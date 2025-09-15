{
  "targets": [
    {
      "target_name": "obsbot_native",
      "sources": [ "src/main.cpp" ],
      "include_dirs": [
        "libdev_v2.1.0_7/include",
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "conditions": [
        ["OS=='win'", {
          "variables": {
            "platform": "<!(node -e \"console.log(process.arch)\")"
          },
          "conditions": [
            ["platform=='x64'", {
              "libraries": [
                "<(module_root_dir)/libdev_v2.1.0_7/windows/win64-release/libdev.lib",
                "<(module_root_dir)/libdev_v2.1.0_7/windows/win64-release/w32-pthreads.lib"
              ],
              "copies": [{
                "files": [
                  "<(module_root_dir)/libdev_v2.1.0_7/windows/win64-release/libdev.dll",
                  "<(module_root_dir)/libdev_v2.1.0_7/windows/win64-release/w32-pthreads.dll"
                ],
                "destination": "<(PRODUCT_DIR)"
              }]
            }]
          ]
        }],
        ["OS=='mac'", {
          "variables": {
            "arch": "<!(node -e \"console.log(process.arch)\")"
          },
          "xcode_settings": {
            "OTHER_LDFLAGS": [
              "-L<(module_root_dir)/libdev_v2.1.0_7/macos/<(arch)-release",
              "-ldev"
            ],
            "GCC_ENABLE_CPP_EXCEPTIONS": "NO",
            "GCC_ENABLE_CPP_RTTI": "NO"
          },
          "copies": [{
            "files": [ "<(module_root_dir)/libdev_v2.1.0_7/macos/<(arch)-release/libdev.dylib" ],
            "destination": "<(PRODUCT_DIR)"
          }]
        }],
        ["OS=='linux'", {
          "variables": {
            "arch": "<!(node -e \"console.log(process.arch === 'arm64' ? 'arm64' : 'x86_64')\")"
          },
          "link_settings": {
            "libraries": [
              "-L<(module_root_dir)/libdev_v2.1.0_7/linux/<(arch)-release",
              "-ldev",
              "-Wl,-rpath,'$$ORIGIN'",
              "-Wl,-rpath,'$$ORIGIN/../../libdev_v2.1.0_7/linux/<(arch)-release'"
            ]
          },
          "copies": [{
            "files": [ "<(module_root_dir)/libdev_v2.1.0_7/linux/<(arch)-release/libdev.so*" ],
            "destination": "<(PRODUCT_DIR)"
          }]
        }]
      ]
    }
  ]
}