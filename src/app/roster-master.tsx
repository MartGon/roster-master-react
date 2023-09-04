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
                <select name="cars" id="cars">
                    <option value="dps">⚔️</option>
                    <option value="heal">🚑</option>
                    <option value="tank">🛡️</option>
                </select>
            </div>
        </div>
    )
}

export function Group({grp_number, players, onFocusOut, onClickGrpCross, raid_index} : 
    {
        grp_number : number, 
        players : Array<PlayerProps>, 
        onFocusOut: (e: FocusEvent<HTMLInputElement>, r : number, g : number, p : number) => void,
        onClickGrpCross : () => void,
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
                    <div className={styles.group_toolbox}>
                        <button onClick={onClickGrpCross} className={styles.group_toolbox_button}>x</button>
                    </div>
                </div>
                {grp}
            </div>
        </>
    )
}

export class RaidProps{
    id: number;
    title: string;
    private groups: Array<{id : number, players: Array<PlayerProps>}>;
    private nextGroupId : number;

    constructor(id :number, title: string, groups: Array<Array<PlayerProps>>){
        this.id = id;
        this.title = title;
        this.groups = groups.map((grp, index) => {
            return {id : index, players: grp};
        })  
        this.nextGroupId = this.groups.length;
    }

    getGroups() : Array<{id : number, players: Array<PlayerProps>}>  {
        return this.groups;
    }

    setGroups(groups : Array<{id : number, players: Array<PlayerProps>}>) : void {
        this.groups
    }

    addGroup(group : {id : number, players: Array<PlayerProps>}) {
        group.id = this.nextGroupId;
        this.groups.push(group)
        this.nextGroupId = group.id + 1;
    }
}

export function Raid({raid, onFocusOut, onClickCross, onClickPlus, onClickGrpCross, raid_index} : 
    {
        raid: RaidProps, 
        onFocusOut: (e: FocusEvent<HTMLInputElement>, p : number, g : number, r : number) => void,
        onClickCross: () => void,
        onClickPlus: () => void,
        onClickGrpCross: (r : number, g : number) => void,
        raid_index : number,
    }){

    const grps = raid.getGroups().map((group, index) =>{

        return (
            <Group key={group.id} raid_index={raid_index} grp_number={Number(index + 1)} players={group.players} onFocusOut={onFocusOut} onClickGrpCross={ () => {onClickGrpCross(raid_index, index)}}/>
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

    const defaultGroup = {id: 0, players: Array(5).fill(0).map(u => (new PlayerProps("priest", "")))};
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

    function onAddRosterClick(){
        let nextRaid = cloneDeep(defaultRaid);
        nextRaid.id = nextRaidId;
        let nextRaids = [...raids, nextRaid];
        setRaids(nextRaids);
        setNextRaidId(nextRaidId + 1)
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
            let group = raid.getGroups()[grp_id];
            group.players[player_id].player_class = db[name].class;
            group.players[player_id].name = name;
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

    function onClickGrpCross(raid_index : number, grp_index : number){
        if(raids[raid_index].getGroups().length > 2){
            let nextRaids = cloneDeep(raids);
            let raid = nextRaids[raid_index];
            raid.getGroups().splice(grp_index, 1);
            setRaids(nextRaids);
        }
    }

    function onClickPlus(raid_index : number){
        if (raids[raid_index].getGroups().length < 5){
            let nextRaids = cloneDeep(raids);
            let raid = nextRaids[raid_index];
            let newGrp = cloneDeep(defaultGroup);
            raid.addGroup(newGrp);
            setRaids(nextRaids);
        }
    }
    
    const raidComps = raids.map((raid, index) => {
        return (
            <Raid key={raid.id} raid_index={index} raid={raid} 
                onFocusOut={onFocusOut} 
                onClickCross={() => {onClickCross(index)}} 
                onClickPlus={() => {onClickPlus(index)}}
                onClickGrpCross={onClickGrpCross}
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

