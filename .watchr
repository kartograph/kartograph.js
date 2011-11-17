watch ( 'src/.*\.coffee' ) { |md| system("coffee -o lib #{md[0]}") }
