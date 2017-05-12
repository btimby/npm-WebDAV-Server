import { StandardResource, IResource, SimpleCallback, ReturnCallback, Return2Callback, ResourceType } from './Resource';
import { ResourceChildren } from './ResourceChildren';
import { FSManager, FSPath } from '../manager/FSManager';
export declare abstract class PhysicalResource extends StandardResource {
    realPath: string;
    constructor(realPath: string, parent: IResource, fsManager: FSManager);
    abstract create(callback: SimpleCallback): any;
    abstract delete(callback: SimpleCallback): any;
    moveTo(to: FSPath, callback: Return2Callback<FSPath, FSPath>): void;
    rename(newName: string, callback: Return2Callback<string, string>): void;
    webName(callback: ReturnCallback<string>): void;
    abstract type(callback: ReturnCallback<ResourceType>): any;
    abstract append(data: Int8Array, callback: SimpleCallback): any;
    abstract write(data: Int8Array, callback: SimpleCallback): any;
    abstract read(callback: ReturnCallback<Int8Array>): any;
    abstract mimeType(callback: ReturnCallback<string>): any;
    abstract size(callback: ReturnCallback<number>): any;
    abstract addChild(resource: IResource, callback: SimpleCallback): any;
    abstract removeChild(resource: IResource, callback: SimpleCallback): any;
    abstract getChildren(callback: ReturnCallback<IResource[]>): any;
}
export declare class PhysicalFolder extends PhysicalResource {
    children: ResourceChildren;
    constructor(realPath: string, parent: IResource, fsManager: FSManager);
    type(callback: ReturnCallback<ResourceType>): void;
    create(callback: SimpleCallback): void;
    delete(callback: SimpleCallback): void;
    append(data: Int8Array, callback: SimpleCallback): void;
    write(data: Int8Array, callback: SimpleCallback): void;
    read(callback: ReturnCallback<Int8Array>): void;
    mimeType(callback: ReturnCallback<string>): void;
    size(callback: ReturnCallback<number>): void;
    addChild(resource: IResource, callback: SimpleCallback): void;
    removeChild(resource: IResource, callback: SimpleCallback): void;
    getChildren(callback: ReturnCallback<IResource[]>): void;
}
export declare class PhysicalFile extends PhysicalResource {
    constructor(realPath: string, parent: IResource, fsManager: FSManager);
    type(callback: ReturnCallback<ResourceType>): void;
    create(callback: SimpleCallback): void;
    delete(callback: SimpleCallback): void;
    append(data: Int8Array, callback: SimpleCallback): void;
    write(data: Int8Array, callback: SimpleCallback): void;
    read(callback: ReturnCallback<Int8Array>): void;
    mimeType(callback: ReturnCallback<string>): void;
    size(callback: ReturnCallback<number>): void;
    addChild(resource: IResource, callback: SimpleCallback): void;
    removeChild(resource: IResource, callback: SimpleCallback): void;
    getChildren(callback: ReturnCallback<IResource[]>): void;
}
