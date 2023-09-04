"use client"

import styles from './page.module.css'
import { ChangeEvent, useState } from 'react';
import React, { FocusEvent } from 'react';
import { loadCharacterDB  } from './character_db';
import { cloneDeep } from 'lodash';

export class PlayerProps{
    player_class : string;
    name : string

    constructor(player_class: string, name: string){
        this.player_class = player_class;
        this.name = name;
    }
}

export function Player({ player, onFocusOut, r, g, p } : 
    {
        player: PlayerProps, 
        onFocusOut: (e: FocusEvent<HTMLInputElement>, r : number, g : number, p : number) => void, 
        r : number, g : number, p : number
    }){
    return (
        <div className={styles.player_slot}>
            <div className={styles[player.player_class]}> 
                <input type="text" className={styles[player.player_class]} defaultValue={player.name} onBlur={(e: FocusEvent<HTMLInputElement>) => {onFocusOut(e, r, g, p)}}/>
            </div>
        </div>
    )
}

export function Group({grp_number, players, onFocusOut, raid_id} : 
    {
        grp_number : number, 
        players : Array<PlayerProps>, 
        onFocusOut: (e: FocusEvent<HTMLInputElement>, r : number, g : number, p : number) => void,
        raid_id : number
    }){

    const grp =  players.map((player, index) =>{
        return (
            <Player key={index} player={player} onFocusOut={onFocusOut} r={raid_id} g={grp_number - 1} p={index}/>
        );
    });

    return (
        <>
            <div className={styles.group}>
                <div className={styles.group_header}>
                    <p>Group {grp_number}</p>
                </div>
                {grp}
            </div>
        </>
    )
}

export class RaidProps{
    title: string;
    groups: Array<Array<PlayerProps>>;

    constructor(title: string, groups: Array<Array<PlayerProps>>){
        this.title = title;
        this.groups = groups
    }
}

export function Raid({raid, onFocusOut, raid_id} : 
    {
        raid: RaidProps, 
        onFocusOut: (e: FocusEvent<HTMLInputElement>, 
        p : number, g : number, r : number) => void,
        raid_id : number,
    }){

    const grps = raid.groups.map((group, index) =>{

        return (
            <Group key={index} grp_number={Number(index + 1)} players={group} onFocusOut={onFocusOut} raid_id={raid_id}/>
        )
    });

    return (
        <>
            <div className={styles.raid}>
                <div className={styles.raid_header}>
                    <input type="text" defaultValue={raid.title}/>
                </div>
                {grps}
            </div>
        </>
    )
}

export default function RosterMaster(){

    const defaultRaid = new RaidProps("Raid 1 - Thursday 19:45", [
        [
            new PlayerProps("death_knight", "Smegknight"),
            new PlayerProps("druid", "Npok"),
            new PlayerProps("hunter", "Paletyam"),
            new PlayerProps("mage", "Gareth"),
            new PlayerProps("paladin", "Aelzara")
        ],
        [
            new PlayerProps("priest", "Reiyna"),
            new PlayerProps("rogue", "Endless"),
            new PlayerProps("shaman", "Gida"),
            new PlayerProps("warlock", "Exhumation"),
            new PlayerProps("warrior", "Ragnaorc")
        ]
    ]);
    let [raids, setRaids] = useState(Array<RaidProps>(1).fill(defaultRaid));
    let [db, setDB] = useState(Object);

    function onAddRosterClick(){
        let nextRaids = [...raids, defaultRaid];
        setRaids(nextRaids);
    }

    function onLoadFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files.length > 0)
        {
            let file = e.target.files[0];
            file.text().then((val) =>{
                const res = loadCharacterDB(val);    
                setDB(res);
            })
        }
    }

    function onFocusOut(event: FocusEvent<HTMLInputElement>, raid_id : number, grp_id : number, player_id : number){
        const name = event.target.value;
        console.log(event.target.value);
        console.log("Raid " + raid_id);
        console.log("Group " + grp_id);
        console.log("Player " + player_id);
        
        const nextRaids = cloneDeep(raids);
        const entry = db[name];
        if(entry){
            nextRaids[raid_id].groups[grp_id][player_id].player_class = db[name].class;
            setRaids(nextRaids);
            console.log("class: " + raids[raid_id].groups[grp_id][player_id].player_class);
        }
        else{
            console.log("Not found!");
        }
    }
    
    const raidComps = raids.map((raid, index) => {
        return (
            <Raid key={index} raid={raid} onFocusOut={onFocusOut} raid_id={index}/>
        )
    });

    return (
        <>
        <div className={styles.page_header}>
            <h1>Roster Master</h1>
            <div className={styles.button_holder}>
                <label>Load Character DB</label>
                <input type='file' accept='.csv' onChange={onLoadFile}></input>
                <button onClick={onAddRosterClick}>Add Raid</button>
            </div>
        </div>
        <div className={styles.page_body}>
            {raidComps}
        </div>
        </>
    )
}

