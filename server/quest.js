// Copyright (C) 2022 Radioactive64

QuestHandler = function(socket, player) {
    var self = {
        qualified: [],
        done: [],
        current: []
    };

    self.startQuest = function(id) {
        if (self.qualifiesFor(id)) {
            self.current[id] = new QuestData(id);
        }
    };
    self.endQuest = function(id, success) {
        if (self.current[id] != null) {
            self.current[id] = null;
            if (success) self.done.push(id);
        } else {
            error('Invalid quest id ' + id);
        }
    };
    self.updateQuestRequirements = function(data) {
        for (var i in self.current) {
            var objectives = self.current[i].objectivesComplete;
            for (var j in objectives) {
                switch (j) {
                    case 'obtain':
                        for (var k in data.aqquiredItems) {
                            for (var l in objectives[j]) {
                                if (k == l) objectives[j][l] += data.aqquiredItems[k];
                            }
                        }
                        break;
                    case 'area':
                        if (Math.sqrt((data.pos.x-self.current[i].objectives[j].x)**2+(data.pos.x-self.current[i].objectives[j].x)**2) < self.current[i].objectives[j].r) {
                            objectives[j] = true;
                        }
                        break;
                    case 'killPlayer':
                        objectives[j] += data.trackedData.playerKills;
                        break;
                    case 'killMonster':
                        for (var k in data.monstersKilled) {
                            console.log(data.monstersKilled[k].id)
                            for (var l in objectives[j]) {
                                if (l == 'any') objectives[j][l] += data.monstersKilled[k].count;
                                if (l == 'bird' && data.monstersKilled[k].id.includes('bird')) objectives[j][l] += data.monstersKilled[k].count;
                                if (l == data.monstersKilled[k].id) objectives[j][l] += data.monstersKilled[k].count;
                            }
                        }
                        // console.log(objectives[j])
                        break;
                    case 'dealDamage':
                        objectives[j] += data.trackedData.damageDealt;
                        break;
                    case 'dps':
                        objectives[j] = data.trackedData.dps;
                        break;
                    default:
                        error('Invalid quest objective ' + j);
                        break;
                }
            }
        }
    };
    self.qualifiesFor = function(id) {
        var quest = QuestData.quests[id];
        if (quest) {
            if (player.xpLevel < quest.requirements.xpLevel) return false;
            for (var i in quest.requirements.completed) {
                if (self.done.indexOf(quest.requirements.completed[i]) == -1) return false;
            }
            return true;
        } else {
            error('Invalid quest id ' + id);
            return false;
        }
    };
    self.getSaveData = function() {
        var pack = {
            done: self.done
        };
        return pack;
    };
    self.loadSaveData = function(data) {
        self.done = data.done;
    };

    return self;
};
QuestData = function(id) {
    var quest = QuestData.quests[id];
    var self = {
        id: id,
        objectives: quest.objectives,
        objectivesComplete: quest.objectives,
        rewards: quest.rewards
    };
    for (var i in self.objectivesComplete) {
        if (typeof self.objectivesComplete == 'object') {
            for (var j in self.objectivesComplete[i]) {
                self.objectivesComplete[i][j] = 0;
            }
            if (i == 'area') self.objectivesComplete[i] = false;
        } else {
            self.objectivesComplete[i] = 0;
        }
    }
    console.log(self)

    return self;
};
QuestData.quests = require('./quests.json');