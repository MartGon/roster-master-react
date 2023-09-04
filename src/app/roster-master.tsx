"use client"

import styles from './page.module.css'
import { ChangeEvent, useState } from 'react';
import React, { FocusEvent } from 'react';
import { loadCharacterDB  } from './character_db';
import { clone, cloneDeep } from 'lodash';
import next from 'next/types';

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

export function Group({grp_number, players, onFocusOut, raid_index} : 
    {
        grp_number : number, 
        players : Array<PlayerProps>, 
        onFocusOut: (e: FocusEvent<HTMLInputElement>, r : number, g : number, p : number) => void,
        raid_index : number
    }){

    const grp =  players.map((player, index) =>{
        return (
            <Player key={index} player={player} onFocusOut={onFocusOut} r={raid_index} g={grp_number - 1} p={index}/>
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
    id: number;
    title: string;
    groups: Array<Array<PlayerProps>>;

    constructor(id :number, title: string, groups: Array<Array<PlayerProps>>){
        this.id = id;
        this.title = title;
        this.groups = groups;
    }
}

export function Raid({raid, onFocusOut, onClickCross, onClickPlus, raid_index} : 
    {
        raid: RaidProps, 
        onFocusOut: (e: FocusEvent<HTMLInputElement>, p : number, g : number, r : number) => void,
        onClickCross: () => void,
        onClickPlus: () => void,
        raid_index : number,
    }){

    const grps = raid.groups.map((group, index) =>{

        return (
            <Group key={index} grp_number={Number(index + 1)} players={group} onFocusOut={onFocusOut} raid_index={raid_index}/>
        )
    });

    return (
        <>
            <div className={styles.raid}>
                <div className={styles.raid_header}>
                    <div className={styles.raid_toolbox}>
                        <button className={styles.raid_toolbox_button} onClick={onClickPlus}>+</button>
                        <button className={styles.raid_toolbox_button} onClick={onClickCross}>x</button>
                    </div>
                    <input type="text" defaultValue={raid.title}/>
                </div>
                {grps}
            </div>
        </>
    )
}

export default function RosterMaster(){

    const defaultGroup = Array(5).fill(0).map(u => (new PlayerProps("priest", "")));
    const defaultRaid = new RaidProps(0, "Raid 1 - Thursday 19:45", [
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
    let [nextRaidId, setNextRaidId] = useState(1);

    function onAddRosterClick(){
        let nextRaid = cloneDeep(defaultRaid);
        nextRaid.id = nextRaidId;
        let nextRaids = [...raids, nextRaid];
        setRaids(nextRaids);
        setNextRaidId(nextRaidId + 1)
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

    function onFocusOut(event: FocusEvent<HTMLInputElement>, raid_index : number, grp_id : number, player_id : number){
        const name = event.target.value;
        console.log(event.target.value);
        console.log("Raid " + raid_index);
        console.log("Group " + grp_id);
        console.log("Player " + player_id);
        
        let nextRaids = cloneDeep(raids);
        const entry = db[name];
        if(entry){
            let raid = nextRaids[raid_index];
            let group = raid.groups[grp_id];
            group[player_id].player_class = db[name].class;
            group[player_id].name = name;
            setRaids(nextRaids);
        }
        else{
            console.log("Not found!");
        }
    }

    function onClickCross(raid_index : number){
        let nextRaids = cloneDeep(raids);
        nextRaids.splice(raid_index, 1);
        setRaids(nextRaids);
        console.log("Removing raid " + raid_index);
    }

    function onClickPlus(raid_index : number){
        if (raids[raid_index].groups.length < 5){
            let nextRaids = cloneDeep(raids);
            let raid = nextRaids[raid_index];
            raid.groups.push(defaultGroup);
            setRaids(nextRaids);
        }
    }
    
    const raidComps = raids.map((raid, index) => {
        return (
            <Raid key={raid.id} raid_index={index} raid={raid} 
                onFocusOut={onFocusOut} 
                onClickCross={() => {onClickCross(index)}} 
                onClickPlus={() => {onClickPlus(index)}}
            />
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

