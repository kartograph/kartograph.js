watch ( 'src/(.*)\.coffee' ) { |md| system("build.sh; ") }
watch ( 'src/colors/(.*)\.coffee' ) { |md| system("build.sh; node tests/test.#{md[1]}.js") }
# watch ( 'tests/test.(.*)\.js' ) { |md| system("node tests/test.#{md[1]}.js") }
