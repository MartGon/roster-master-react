# roster-master-react

## Description

**roster-master-react** is the ReactJS front-end implementation of [RosterMaster](https://github.com/MartGon/RosterMaster). This project is a work in progress that attempts to remove the need to use Google Sheets to manually create the rosters, and work as fully-featured user interface for the whole application.

![sample-roster.png](https://raw.githubusercontent.com/MartGon/roster-master-react/main/docs/imgs/roster-master.png)

## How to use

At the moment, the project implements the following features:
- Add/Remove raid rosters.
- Add/Remove groups in each of the raids.
- Link a **characters-db.csv** to automatically switch the player's class color when a specific name is typed.
- Set player roles.

## Future work

The first version of this project would be considered complete, once the following features are finally implemented:

- Drag and drop feature for players. So typing their names is not needed to move them around between raids or groups.
- Check rosters' validity. By donig a resquest to a server runnnig RosterMaster, check whether the rosters made are valid.
- Display errors. After a check, errors could be displayed in a Pop up window next to each roster to  get more information about the error.

## About

My first project using ReactJS.



