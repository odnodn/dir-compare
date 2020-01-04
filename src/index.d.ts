/// <reference types="node" />

import * as fs from "fs"

export function compareSync(path1: string, path2: string, options?: Options): Statistics
export function compare(path1: string, path2: string, options?: Options): Promise<Statistics>

export interface Options {
    /**
     * Properties to be used in various extension points ie. result builder.
     */
    [key: string]: any

    /**
     * Compares files by size. Defaults to 'false'.
     */
    compareSize?: boolean

    /**
     *  Compares files by date of modification (stat.mtime). Defaults to 'false'.
     */
    compareDate?: boolean

    /**
     * Two files are considered to have the same date if the difference between their modification dates fits within date tolerance. Defaults to 1000 ms.
     */
    dateTolerance?: number

    /**
     * Compares files by content. Defaults to 'false'.
     */
    compareContent?: boolean

    /**
     * Compares entries by symlink. Defaults to 'false'.
     */
    compareSymlink?: boolean

    /**
     * Skips sub directories. Defaults to 'false'.
     */
    skipSubdirs?: boolean

    /**
     * Ignore symbolic links. Defaults to 'false'.
     */
    skipSymlinks?: boolean

    /**
     * Ignores case when comparing names. Defaults to 'false'.
     */
    ignoreCase?: boolean

    /**
     * Toggles presence of diffSet in output. If true, only statistics are provided. Use this when comparing large number of files to avoid out of memory situations. Defaults to 'false'.
     */
    noDiffSet?: boolean

    /**
     * File name filter. Comma separated minimatch patterns.
     */
    includeFilter?: string

    /**
     * File/directory name exclude filter. Comma separated minimatch patterns.
     */
    excludeFilter?: string

    /**
     * Callback for constructing result.
     * Called for each compared entry pair.
     * Updates 'statistics' and 'diffSet'.
     */
    resultBuilder?: ResultBuilder

    /**
     * File comparison handler.
     */
    compareFileSync?: CompareFileSync

    /**
     * File comparison handler.
     */
    compareFileAsync?: CompareFileAsync
}

/**
 * Callback for constructing result.
 * Called for each compared entry pair.
 * Updates 'statistics' and 'diffSet'.
 */
export type ResultBuilder = (
    entry1: Entry | undefined,
    entry2: Entry | undefined,
    state: DifferenceState,
    level: number,
    relativePath: string,
    options: Options,
    statistics: Statistics,
    diffSet: Array<Difference> | undefined,
    reason: Reason | undefined
) => void

export interface Entry {
    name: string
    absolutePath: string
    path: string
    stat: fs.Stats
    lstat: fs.Stats
    symlink: boolean
}

export interface Statistics {
    /**
     * Any property is allowed if default result builder is not used.
     */
    [key: string]: any

    /**
     * number of distinct entries.
     */
    distinct: number

    /**
     * number of equal entries.
     */
    equal: number

    /**
     * number of entries only in path1.
     */
    left: number

    /**
     * number of entries only in path2.
     */
    right: number

    /**
     * total number of differences (distinct+left+right).
     */
    differences: number

    /**
     * total number of entries (differences+equal).
     */
    total: number

    /**
     * number of distinct files.
     */
    distinctFiles: number

    /**
     * number of equal files.
     */
    equalFiles: number

    /**
     * number of files only in path1.
     */
    leftFiles: number

    /**
     * number of files only in path2
     */
    rightFiles: number

    /**
     * total number of different files (distinctFiles+leftFiles+rightFiles).
     */
    differencesFiles: number

    /**
     * total number of files (differencesFiles+equalFiles).
     */
    totalFiles: number

    /**
     * number of distinct directories.
     */
    distinctDirs: number

    /**
     * number of equal directories.
     */
    equalDirs: number

    /**
     * number of directories only in path1.
     */
    leftDirs: number

    /**
     * number of directories only in path2.
     */
    rightDirs: number

    /**
     * total number of different directories (distinctDirs+leftDirs+rightDirs).
     */
    differencesDirs: number

    /**
     * total number of directories (differencesDirs+equalDirs).
     */
    totalDirs: number

    /**
     * number of broken links only in path1
     */
    leftBrokenLinks: number

    /**
     * number of broken links only in path2
     */
    rightBrokenLinks: number

    /**
     * number of broken links with same name appearing in both path1 and path2
     */
    distinctBrokenLinks: number

    /**
     * total number of broken links
     */
    totalBrokenLinks: number

    /**
     * statistics available if 'compareSymlink' options is used.
     */
    symlinks?: SymlinkStatistics

    /**
     * true if directories are identical.
     */
    same: boolean

    /**
     * List of changes (present if Options.noDiffSet is false).
     */
    diffSet?: Array<Difference>
}

export interface SymlinkStatistics {
    /**
     * number of distinct links.
     */
    distinctSymlinks: number

    /**
     * number of equal links.
     */
    equalSymlinks: number

    /**
     * number of links only in path1.
     */
    leftSymlinks: number

    /**
     * number of links only in path2
     */
    rightSymlinks: number

    /**
     * total number of different links (distinctSymlinks+leftSymlinks+rightSymlinks).
     */
    differencesSymlinks: number

    /**
     * total number of links (differencesSymlinks+equalSymlinks).
     */
    totalSymlinks: number

}

export type DifferenceState = "equal" | "left" | "right" | "distinct"
export type DifferenceType = "missing" | "file" | "directory" | "broken-link"
export type Reason = "different-size" | "different-date" | "different-content" | "broken-link" | 'different-symlink'
export interface Difference {
    /**
     * Any property is allowed if default result builder is not used.
     */
    [key: string]: any

    /**
     * path not including file/directory name; can be relative or absolute depending on call to compare().
     */
    path1?: string

    /**
     * path not including file/directory name; can be relative or absolute depending on call to compare().
     */
    path2?: string

    /**
     * path relative to root.
     */
    relativePath: string

    /**
     * file/directory name.
     */
    name1?: string

    /**
     * file/directory name.
     */
    name2?: string

    /**
     * one of equal, left, right, distinct.
     */
    state: DifferenceState

    /**
     * one of missing, file, directory.
     */
    type1: DifferenceType

    /**
     * one of missing, file, directory.
     */
    type2: DifferenceType

    /**
     * file size.
     */
    size1?: number

    /**
     * file size.
     */
    size2?: number

    /**
     * modification date (stat.mtime).
     */
    date1?: number

    /**
     * modification date (stat.mtime).
     */
    date2?: number

    /**
     * depth.
     */
    level: number

    /**
     * Provides reason when two identically named entries are distinct.
     * Not available if entries are equal.
     * One of "different-size", "different-date", "different-content", "broken-link", "different-symlink".
     */
    reason?: Reason
}

export type CompareFileSync = (
    path1: string,
    stat1: fs.Stats,
    path2: string,
    stat2: fs.Stats,
    options: Options
) => boolean

export type CompareFileAsync = (
    path1: string,
    stat1: fs.Stats,
    path2: string,
    stat2: fs.Stats,
    options: Options
) => Promise<boolean>

export const fileCompareHandlers: {
    defaultFileCompare: {
        compareSync: CompareFileSync,
        compareAsync: CompareFileAsync
    },
    lineBasedFileCompare: {
        compareSync: CompareFileSync,
        compareAsync: CompareFileAsync
    }
}
