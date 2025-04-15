export type ExerciseType = 'running' | 'squat' | 'pushup' | 'plank';

export interface ExerciseInfo {
  id: ExerciseType;
  title: string;
  description: string;
  keyPoints: string[];
  feedback: string[];
  encouragements: string[];
}

export const EXERCISE_TYPES: Record<ExerciseType, ExerciseInfo> = {
  running: {
    id: 'running',
    title: '跑步',
    description: '通过跑步提高心肺功能和耐力',
    keyPoints: [
      '保持身体略微前倾',
      '手臂自然摆动',
      '膝盖抬起适中',
      '脚掌着地要轻柔'
    ],
    feedback: [
      '你的跑步姿势很标准，继续保持！',
      '注意调整身体前倾的角度，保持自然',
      '手臂摆动幅度可以再自然一些',
      '膝盖抬起的高度很好，保持这个水平'
    ],
    encouragements: [
      '你的跑步姿势越来越好了！',
      '保持这个节奏，你做得很棒！',
      '呼吸节奏很稳定，继续加油！'
    ]
  },
  squat: {
    id: 'squat',
    title: '深蹲',
    description: '锻炼下肢力量和核心稳定性',
    keyPoints: [
      '双脚与肩同宽',
      '膝盖不要超过脚尖',
      '保持背部挺直',
      '臀部要下沉'
    ],
    feedback: [
      '深蹲姿势标准，重心很稳！',
      '注意保持背部挺直，不要弓背',
      '膝盖和脚尖方向保持一致',
      '下蹲深度适中，很好！'
    ],
    encouragements: [
      '你的深蹲姿势很标准！',
      '核心力量控制得很好！',
      '保持这个稳定性，继续加油！'
    ]
  },
  pushup: {
    id: 'pushup',
    title: '俯卧撑',
    description: '锻炼上肢力量和核心稳定性',
    keyPoints: [
      '双手与肩同宽',
      '保持身体成一条直线',
      '肘部贴近身体',
      '核心保持收紧'
    ],
    feedback: [
      '俯卧撑姿势很规范，继续保持！',
      '注意保持身体成一条直线',
      '下压时肘部要贴近身体',
      '核心收紧做得很好！'
    ],
    encouragements: [
      '你的俯卧撑动作很标准！',
      '力量控制得很好，继续保持！',
      '节奏很稳定，再加把劲！'
    ]
  },
  plank: {
    id: 'plank',
    title: '平板支撑',
    description: '锻炼核心力量和身体稳定性',
    keyPoints: [
      '肘部在肩膀正下方',
      '保持身体成一条直线',
      '核心持续收紧',
      '臀部不要抬高或下沉'
    ],
    feedback: [
      '平板支撑姿势很标准！',
      '核心收紧得很好，保持住！',
      '身体线条保持得很直，继续！',
      '肘部位置很准确，就是这样！'
    ],
    encouragements: [
      '你的平板支撑很稳定！',
      '核心力量体现得很好！',
      '再坚持一下，你做得到！'
    ]
  }
}; 