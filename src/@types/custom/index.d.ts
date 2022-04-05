declare namespace custom {
  /**
   * 能力花费
   */
  interface AbilityCost {
    move: number;
    work: number;
    carry: number;
    attack: number;
    ranged_attack: number;
    heal: number;
    claim: number;
    tough: number;
  }

  /**
   * 蓝图
   */
  interface CreePlan {
    amounts: Array<number>;
    abilities: BodyPartConstant[][];
  }

  /**
   * 房间信息
   */
  interface RoomInfo {
    id: string;
    name: string;
    resources: Array<{
      id: string;
      type: string;
    }>;
    controller: {
      id: string;
    };
    link: {
      output: Array<string>;
      input: Array<string>;
    };
  }
}