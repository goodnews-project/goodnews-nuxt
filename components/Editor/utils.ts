import {
  SlateTransforms,
  SlateEditor,
  SlateNode,
  SlateElement,
  SlateText,
  SlateLocation,
  SlatePath,
  SlatePoint,
  SlateRange,
  type IDomEditor,
} from '@wangeditor/editor';

// 获取当前编辑器的光标位置
export const getCurrentSelection = (editor: IDomEditor) => {
  const { selection } = editor;
  if (selection) {
    const [start] = SlateRange.edges(selection);
    const startNode = SlateEditor.node(editor, start.path);
    return startNode;
  }

  return null;
};

// 获取当前光标所在节点的range范围
export const getRangeByNode = (editor: IDomEditor, nodeToSelect: any) => {
  const pathToSelect = SlateEditor.path(editor, nodeToSelect);
  const range = SlateEditor.range(editor, pathToSelect) as any;
  const newRange = {
    anchor: {
      offset: 0,
      path: range.anchor[1],
    },
    focus: {
      offset: range.focus[0].text.length,
      path: range.focus[1],
    },
  };
  return newRange;
};
