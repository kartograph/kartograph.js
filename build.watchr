watch ( 'src/(.*)\.coffee' ) { |md| system("build.sh; node tests/test.#{md[1]}.js") }
