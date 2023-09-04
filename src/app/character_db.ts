import { parse } from 'csv-parse/sync';

export function loadCharacterDB(file : string){
    const headers = {"name" : 0, "class" : 1}
    const class_mapping : { [key:string] : string } = {  
        'Death Knight' : 'death_knight', "Druid" : 'druid', 'Hunter' : 'hunter',
        'Mage' : 'mage', 'Paladin' : 'paladin', 'Priest' : 'priest',
        'Rogue' : 'rogue', 'Shaman' : 'shaman', 'Warlock' : 'warlock', "Warrior" : 'warrior',
    }
    const records = parse(file, { skipEmptyLines : true});

    let db : { [key:string] : {name : string, class : string}} = {};
    for(let i : number = 0; i < records.length; i++)
    {
        const entry = records[i];
        const name : string = entry[headers.name];
        const pclass : string = entry[headers.class];
        db[name] = {"name" : name, "class" : class_mapping[pclass] };
    }

    return db;
}