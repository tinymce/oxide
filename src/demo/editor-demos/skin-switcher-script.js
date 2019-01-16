/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 */

// Load a different skin by adding the skin name as a url parameter
// by appending the url like this: ?skin=oxide-dark
// Available skins are located in ./build/skins/
let url = new URL (window.location.href);
let skin = url.searchParams.get('skin');
let contentcss = url.searchParams.get('contentcss');
if (!skin) skin = 'default';
