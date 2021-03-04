# POS Developer Samples

## Dependencies Samples

The sample provided that uses a custom knockout version doesn't have the knockout declaration file because they're not available on a reliable nuget feed. The declaration file should be added manually following the steps:

1. Access [knockout official releases](https://github.com/knockout/knockout/releases).
2. Download the source code (zip) of the version that was included as a dependency in the _manifest.json_.
3. Extract the content of the zip file. The types are localted at _<KNOCKOUT_LIBRARY_FOLDER>\build\types\knockout.d.ts_.
4. Copy the _knockout.d.ts_ file to any folder in the extension project.
5. Include the _knockout.d.ts_ file in the project in case it wasn't included automatically.

The types for the knockout should be available now. Similar process should be done for any other added library dependency.