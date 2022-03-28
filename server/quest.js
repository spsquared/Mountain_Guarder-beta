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
    self.updateQuestRequirements = function() {

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
        } else {
            self.objectivesComplete[i] = 0;
        }
    }
    console.log(self)

    return self;
};
QuestData.quests = require('./quests.json');