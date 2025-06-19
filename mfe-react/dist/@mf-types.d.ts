
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/Component';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/Component' ? typeof import('REMOTE_ALIAS_IDENTIFIER/Component') :any;