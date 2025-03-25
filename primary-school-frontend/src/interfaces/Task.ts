export interface ITask {
    _id: number;
    name: string;
    descriptions: string;
    attachments: {
        type: 'video' | 'image' | 'text' | 'game';
        url: string;
        title?: string;
    }[];
    // add other task properties here
}

export interface ITaskCreate {
    name: string;
    description: string;
    subjectId: string;
    attachments: {
        type: 'video' | 'image' | 'text' | 'game';
        url: string;
        title?: string;
    }[];
}
