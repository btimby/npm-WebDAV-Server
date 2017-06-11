import { HTTPCodes, MethodCallArgs, WebDAVRequest } from '../WebDAVRequest'
import { IResource } from '../../resource/IResource'
import { Readable, Transform } from 'stream'

class RangedStream extends Transform
{
    nb : number;

    constructor(public min : number, public max : number)
    {
        super();

        this.nb = 0;
    }

    _transform(chunk: any, encoding: string, callback: Function)
    {
        if(this.nb < this.min)
        {
            this.nb += chunk.length;
            if(this.nb > this.min)
            {
                chunk = chunk.slice(this.nb - this.min);
                callback(null, chunk);
            }
            else
                callback(null, new Buffer(0));
        }
        else if(this.nb > this.max)
        {
            this.nb += chunk.length;
            callback(null, new Buffer(0));
        }
        else
        {
            this.nb += chunk.length;
            if(this.nb > this.max)
                chunk = chunk.slice(0, this.max - (this.nb - chunk.length));
            callback(null, chunk);
        }
    }
}

export default function(arg : MethodCallArgs, callback)
{
    arg.noBodyExpected(() => {
        arg.getResource((e, r) => {
            if(e)
            {
                arg.setCode(HTTPCodes.NotFound)
                callback();
                return;
            }

            arg.checkIfHeader(r, () => {
                const targetSource = arg.isSource;

                arg.requirePrivilege(targetSource ? [ 'canRead', 'canSource' ] : [ 'canRead' ], r, () => {
                    r.read(targetSource, (e, rstream) => process.nextTick(() => {
                        if(e)
                        {
                            arg.setCode(HTTPCodes.MethodNotAllowed);
                            callback();
                        }
                        else
                        {
                            arg.invokeEvent('read', r);

                            const range = arg.findHeader('Range');
                            if(range)
                            {
                                const rex = /([0-9]+)/g;
                                const min = parseInt(rex.exec(range)[1], 10);
                                const max = parseInt(rex.exec(range)[1], 10);

                                arg.setCode(HTTPCodes.PartialContent);
                                arg.response.setHeader('Accept-Ranges', 'bytes')
                                arg.response.setHeader('Content-Length', (max - min).toString())
                                arg.response.setHeader('Content-Range', 'bytes ' + min + '-' + max + '/*')

                                rstream.on('end', callback);
                                rstream.pipe(new RangedStream(min, max)).pipe(arg.response);
                            }
                            else
                            {
                                arg.setCode(HTTPCodes.OK);
                                rstream.on('end', callback);
                                rstream.pipe(arg.response);
                            }
                        }
                    }))
                })
            })
        })
    })
}
