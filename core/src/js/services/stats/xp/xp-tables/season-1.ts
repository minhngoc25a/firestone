import {Map} from 'immutable';
import {Season} from './_season';

export class Season1 implements Season {
    public readonly startDate: Date = new Date(2020, 10, 1);
    public readonly endDate: Date = new Date(2021, 3, 30);
    public readonly bonusXp = 4500;
    public readonly xpPerLevel: Map<number, number> = Map([
        [1, 0],
        [2, 100],
        [3, 150],
        [4, 200],
        [5, 300],
        [6, 450],
        [7, 600],
        [8, 750],
        [9, 900],
        [10, 1050],
        [11, 1250],
        [12, 1500],
        [13, 1750],
        [14, 2000],
        [15, 2200],
        [16, 2400],
        [17, 2500],
        [18, 2600],
        [19, 2700],
        [20, 2800],
        [21, 2900],
        [22, 3000],
        [23, 3100],
        [24, 3200],
        [25, 3300],
        [26, 3450],
        [27, 3600],
        [28, 3750],
        [29, 3900],
        [30, 4050],
        [31, 4250],
        [32, 4450],
        [33, 4650],
        [34, 4850],
        [35, 5050],
        [36, 5300],
        [37, 5550],
        [38, 5800],
        [39, 6050],
        [40, 6300],
        [41, 6600],
        [42, 6900],
        [43, 7200],
        [44, 7500],
        [45, 7800],
        [46, 8100],
        [47, 8400],
        [48, 8700],
        [49, 9000],
        [50, 9300],
        [51, 4000],
        [52, 4050],
        [53, 4100],
        [54, 4150],
        [55, 4200],
        [56, 4250],
        [57, 4300],
        [58, 4350],
        [59, 4400],
        [60, 4500],
    ]);

    public getXpForLevel(level: number): number {
        if (this.xpPerLevel.includes(level)) {
            return this.xpPerLevel.get(level);
        }
        return this.bonusXp;
    }
}
