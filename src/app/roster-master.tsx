"use client"

import styles from './page.module.css'
import { useState } from 'react';

export class PlayerProps{
    player_class : string;
    name : string

    constructor(player_class: string, name: string){
        this.player_class = player_class;
        this.name = name;
    }
}

export function Player({ player_class, name } : PlayerProps){
    return (
        <div className={styles.player_slot}>
            <div className={styles[player_class]}> 
                <input className={styles[player_class]} defaultValue={name}/>
            </div>
        </div>
    )
}

export function Group({grp_number, players} : {grp_number : number, players : Array<PlayerProps>}){

    const grp =  players.map((player, index) =>{
        return (
            <Player key={index} player_class={player.player_class} name={player.name}/>
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

export function Raid({raid} : {raid: RaidProps}){

    const grps = raid.groups.map((group, index) =>{

        return (
            <Group key={index} grp_number={Number(index + 1)} players={group}/>
        )
    });

    return (
        <>
            <div className={styles.raid}>
                <div className={styles.raid_header}>
                    <p>{raid.title}</p>
                </div>
                {grps}
            </div>
        </>
    )
}

export default function Rosters(){

    let [raids, setRaids] = useState(Array<RaidProps>);
    const prepRaids = [
        new RaidProps("Raid 1 - Thursday 19:45", [
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
        ])
    ]

    const raidComps = prepRaids.map((raid, index) => {
        return (
            <Raid key={index} raid={raid}/>
        )
    });

    return (
        <>
            {raidComps}
        </>
    )
}