import _ from 'lodash';

export default (children: any, condition: (child: any) => boolean) => {
    if (!children) return [[],[]];
    if (Array.isArray(children)) {
        return _.partition(children, condition);
    }
    if (condition(children)) {
        return [[children], []];
    }
    return [[],[children]];
};