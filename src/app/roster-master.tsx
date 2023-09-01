"use client"

import next from 'next/types';
import styles from './page.module.css'
import { useState } from 'react';
import React, { FocusEvent } from 'react';

export class PlayerProps{
    player_class : string;
    name : string

    constructor(player_class: string, name: string){
        this.player_class = player_class;
        this.name = name;
    }
}

export function Player({ player, onFocusOut } : {player: PlayerProps, onFocusOut: (e: FocusEvent<HTMLInputElement>) => void}){
    return (
        <div className={styles.player_slot}>
            <div className={styles[player.player_class]}> 
                <input type="text" className={styles[player.player_class]} defaultValue={player.name} onBlur={(e: FocusEvent<HTMLInputElement>) => onFocusOut(e)}/>
            </div>
        </div>
    )
}

export function Group({grp_number, players, onFocusOut} : {grp_number : number, players : Array<PlayerProps>, onFocusOut: (e: FocusEvent<HTMLInputElement>) => void}){

    const grp =  players.map((player, index) =>{
        return (
            <Player key={index} player={player} onFocusOut={onFocusOut}/>
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

export function Raid({raid, onFocusOut} : {raid: RaidProps, onFocusOut: (e: FocusEvent<HTMLInputElement>) => void}){

    const grps = raid.groups.map((group, index) =>{

        return (
            <Group key={index} grp_number={Number(index + 1)} players={group} onFocusOut={onFocusOut}/>
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
    function onFocusOut(event: FocusEvent<HTMLInputElement>){
        console.log("Left focus");
        console.log(event.target.value);
    }

    const raidComps = raids.map((raid, index) => {
        return (
            <Raid key={index} raid={raid} onFocusOut={onFocusOut}/>
        )
    });

    function onAddRosterClick(){
        let nextRaids = [...raids, defaultRaid];
        setRaids(nextRaids);
    }

    return (
        <>
        <div className={styles.page_header}>
            <h1>Roster Master</h1>
            <div className={styles.button_holder}>
                <button onClick={onAddRosterClick}>Add Raid</button>
            </div>
        </div>
        <div className={styles.page_body}>
            {raidComps}
        </div>
        </>
    )
}