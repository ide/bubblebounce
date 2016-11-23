#!/usr/bin/env python
import os
import os.path

# find node_modules -type f -not -regex ".*react-native\/.*" -name ".babelrc" -exec rm -rf {} \;

for root, dirs, files in os.walk('node_modules'):
    if 'react-native' + os.sep in root:
        continue
    for filename in files:
        if filename == '.babelrc':
            os.remove(os.path.join(root, filename))
