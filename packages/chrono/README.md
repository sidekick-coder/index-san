# Chrono File versioning

Chrono is a project for file versioning focus on large files and optimize storage usage.

It is designed based on [Git](https://git-scm.com/) structure, but with changes to handle our specific needs.

## Optimization storage usage

One of the main goals of Chrono is to optimize storage usage and be able to remove unused versions of files when needed but still keep the history of the file.

Also it should should be able to restore the file contents from a remote server, like AWS S3 or a custom server.

To achieve this goal, Chrono uses a strategy to have 2 databases:

One is the **blobs database**, that are simple copies of a files using a **hash** as the file name, this hash is a SHA1 based on the file contents which makes it unique for each file.

The other one is the **objects database**, that are simple text files with metadata that points to the blobs, or other objects to form a tree, they also use a **hash** as the file name.

This strategy makes that the the only heavy files to be stored in the blobs database, and the objects database will be just text files with a few bytes.

This enables us to remove unused blobs to free up space when needed, but still keeps relevant versioning data in the objects database.

Also this enables the ability to restore a blob from a remote server using the information stored in the objects database.

Of course, this strategy has some drawbacks, like the need to have 2 databases, and that without right entry in the blobs database a file cannot be restored even if the objects database has the right entries, but this is a tradeoff that we are willing to take.

## Programmatic API

Chrono is a javascript lib and is designed to be used programmatically, so it can be used in any project that needs file versioning.
