const fs = require('fs');

const main = () => {
    const trials = generateTrials(20, false);

    writeTrialsToFile('../public/static/json/trials.json', trials);
}

const generateTrials = (amount, offsetEnabled = false) => {

    const trials = [...Array(amount).keys()].map((_, index) => {

        if (offsetEnabled) {
            const offset = index % 2 == 0 ? 10 : -10;

            return generateTrialFromBlueprint(offset);
        }
        return generateTrialFromBlueprint();

    });

    if (offsetEnabled) {
        return trials
            .map(trial => ({ trial, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({trial}) => trial)
    }

    return trials;
}

const generateTrialFromBlueprint = (offset) => {

    const blueprint = {
        layout: [2, 2],
        children: [
            {
                direction: 'up',
                layout: [2, 1],
                children: [
                    {
                        direction: 'up',
                        layout: [2, 0],
                        children: [
                            {
                                direction: 'left',
                                layout: [1, 0]
                            },

                            {
                                direction: 'right',
                                layout: [3, 0]
                            }
                        ]
                    }
                ]
            },
            {
                direction: 'right',
                layout: [3, 2],
                children: [
                    {
                        direction: 'right',
                        layout: [4, 2],
                        children: [
                            {
                                direction: 'up',
                                layout: [4, 1]
                            },

                            {
                                direction: 'down',
                                layout: [4, 3]
                            }
                        ]
                    }
                ]
            },
            {
                direction: 'down',
                layout: [2, 3],
                children: [
                    {
                        direction: 'down',
                        layout: [2, 4],
                        children: [
                            {
                                direction: 'right',
                                layout: [3, 4]
                            },

                            {
                                direction: 'left',
                                layout: [1, 4]
                            }
                        ]
                    }
                ]
            },
            {
                direction: 'left',
                layout: [1, 2],
                children: [
                    {
                        direction: 'left',
                        layout: [0, 2],
                        children: [
                            {
                                direction: 'up',
                                layout: [0, 1]
                            },

                            {
                                direction: 'down',
                                layout: [0, 3]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    const trial = {
        type: 'mouselab-mdp', // use the jspsych plugin
        // ---------- MANDATORY PARAMETERS ---------- #
        graph: {},
        layout: {},
        initial: '2_2', // initial state of player
        // ---------- OPTIONAL PARAMETERS ---------- #
        stateLabels: {},
        stateDisplay: 'click', // one of 'never', 'hover', 'click', 'always'
        stateClickCost: 1, // subtracted from score every time a state is clicked,
        edgeLabels: 'reward', // object mapping from edge names (s0 + '__' + s1) to labels
        edgeDisplay: 'never', // one of 'never', 'hover', 'click', 'always'
        edgeClickCost: 0, // subtracted from score every time an edge is clicked
        playerImage: 'static/images/plane.png',
        playerImageScale: 0.3,
        size: 120, // determines the size of states, text, etc...
        centerMessage: 'click on the fields to unveil their rewards'
    };

    const graph = {};
    const layout = {};
    const stateLabels = {};

    const rootName = getName(blueprint.layout);

    layout[rootName] = blueprint.layout;
    graph[rootName] = {};

    blueprint.children.forEach(branch => {
        const branchName = getName(branch.layout);
        const branchReward = getReward(1, offset);

        graph[rootName][branch.direction] = [branchReward, branchName];
        layout[branchName] = branch.layout;

        stateLabels[branchName] = branchReward;

        graph[branchName] = {};

        branch.children.forEach(stem => {
            const stemName = getName(stem.layout);
            const stemReward = getReward(2, offset);

            graph[branchName][stem.direction] = [stemReward, stemName];
            layout[stemName] = stem.layout;

            stateLabels[stemName] = stemReward;

            graph[stemName] = {}

            stem.children.forEach(node => {
                const nodeName = getName(node.layout);
                const nodeReward = getReward(3, offset)

                graph[stemName][node.direction] = [nodeReward, nodeName];
                layout[nodeName] = node.layout;

                stateLabels[nodeName] = nodeReward;
            })
        })
    });

    trial.layout = layout;
    trial.graph = graph;
    trial.stateLabels = stateLabels;

    return trial;
}

const getName = (layoutData => {
    const [x, y] = layoutData;

    return `${x}_${y}`;
});

const getReward = (step, offset) => {

    const initialRewards = [-4, -2, 2, 4];

    if (step == 1) {
        return chooseReward(initialRewards, offset);
    }

    if (step == 2) {
        return chooseReward(initialRewards.map(reward => reward * 2), offset);
    }

    return chooseReward(initialRewards.map(reward => reward * 4), offset);
}

const chooseReward = (rewardRange, offset) => {

    const reward = rewardRange[Math.floor(Math.random() * rewardRange.length)];

    if (offset) {
        return reward + offset;
    }

    return reward;
}

const writeTrialsToFile = (fileName, data) => {
    const jsonData = JSON.stringify(data);

    fs.writeFileSync(fileName, jsonData);
}

main();