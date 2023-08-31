import styles from './page.module.css'

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
                <p className={styles[player_class]}>{name}</p>
            </div>
        </div>
    )
}

export function Group({grp_number, players} : {grp_number : number, players : Array<PlayerProps>}){

    const grp =  players.map((player, index) =>{
        return (
            <Player player_class={player.player_class} name={player.name}/>
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

export default function Raid(){

    const grp1 = [
        new PlayerProps("death_knight", "Smegknight"),
        new PlayerProps("druid", "Npok"),
        new PlayerProps("hunter", "Paletyam"),
        new PlayerProps("mage", "Gareth"),
        new PlayerProps("paladin", "Aelzara")
    ];
    const grp2 = [
        new PlayerProps("priest", "Reiyna"),
        new PlayerProps("rogue", "Endless"),
        new PlayerProps("shaman", "Gida"),
        new PlayerProps("warlock", "Exhumation"),
        new PlayerProps("warrior", "Ragnaorc")
    ]

    return (
        <>
            <div className={styles.raid}>
                <div className={styles.raid_header}>
                    <p>Raid 1 - Thursday 19:45</p>
                </div>
                <Group grp_number={Number(1)} players={grp1}/>
                <Group grp_number={Number(2)} players={grp2}/>
            </div>
        </>
    )
}