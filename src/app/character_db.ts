import { parse } from 'csv-parse/sync';

export function loadCharacterDB(file : string){
    const headers = {"name" : 0, "class" : 1}
    const records = parse(file, { skipEmptyLines : true});

    let db : { [key:string] : {name : string, class : string}} = {};
    for(let i : number = 0; i < records.length; i++)
    {
        const entry = records[i];
        const name : string = entry[headers.name];
        db[name] = {"name" : name, "class" : entry[headers.class] };
    }

    return db;
}