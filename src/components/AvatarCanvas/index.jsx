import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import _ from "lodash";

export function buildAccessoriesTree(accessories) {
  let tree = {
    type: "root",
    nodes: {},
  };

  let ctx = tree.nodes;

  accessories.forEach((accessory) => {
    const nodes = accessory.path;

    nodes.reduce((ctx, node, index) => {
      const isAccessory = nodes.length - 1 == index;

      if (!ctx[node.key]) {
        let element = {
          type: isAccessory ? "accessory" : "node",
          nodeKey: node.key,
          nodeLabel: node.label,
          listOrder: node.listOrder,
        };

        const nextElement = nodes[index + 1];
        const isComponent = nextElement && nextElement.label.includes("部分");

        if (isAccessory) {
          element.key = accessory.key;
        } else {
          element.nodes = {};
          element.selectType = isComponent ? "combine" : "radio";
        }

        ctx[node.key] = element;
      }

      if (!isAccessory) {
        ctx = ctx[node.key].nodes;
      }

      return ctx;
    }, ctx);
  });

  return tree;
}

function buildAvatarTree(
  {
    defaultAccessoryTreeCtx,
    accessoryTreeCtx,
    rootTreeCtx,
    avatarTreeCtx,
    avatarAccessorieKeysRef,
  },
  ctxLevel,
) {
  ctxLevel = ctxLevel || 0;
  let nodeKeys = Object.keys(rootTreeCtx.nodes || {});

  if (nodeKeys.length === 0) {
    return;
  }

  // 获取传入配件内容
  for (var nodeKey of nodeKeys) {
    const accessoryNode =
      accessoryTreeCtx.nodes && accessoryTreeCtx.nodes[nodeKey];

    if (accessoryNode) {
      if (accessoryNode.type == "accessory") {
        avatarTreeCtx[nodeKey] = {
          key: accessoryTreeCtx.nodes[nodeKey].key,
        };
        avatarAccessorieKeysRef.push(accessoryNode.key);

        if (rootTreeCtx.selectType === "radio") {
          break;
        }
      } else {
        avatarTreeCtx[nodeKey] = {};

        buildAvatarTree(
          {
            defaultAccessoryTreeCtx: _.get(
              defaultAccessoryTreeCtx,
              ["nodes", nodeKey],
              {},
            ),
            accessoryTreeCtx: _.get(accessoryTreeCtx, ["nodes", nodeKey], {}),
            rootTreeCtx: _.get(rootTreeCtx, ["nodes", nodeKey], {}),
            avatarTreeCtx: avatarTreeCtx[nodeKey],
            avatarAccessorieKeysRef,
          },
          ctxLevel + 1,
        );
      }
    }
  }

  if (rootTreeCtx.selectType === "radio") {
    if (Object.keys(avatarTreeCtx).length > 0) {
      return;
    }
  }

  for (var nodeKey of nodeKeys) {
    const accessoryNode =
      accessoryTreeCtx.nodes && accessoryTreeCtx.nodes[nodeKey];
    const defaultAccessoryNode =
      defaultAccessoryTreeCtx.nodes && defaultAccessoryTreeCtx.nodes[nodeKey];

    if (accessoryNode) {
      continue;
    } else if (defaultAccessoryNode) {
      if (defaultAccessoryNode.type == "accessory") {
        avatarTreeCtx[nodeKey] = {
          key: defaultAccessoryNode.key,
        };
        avatarAccessorieKeysRef.push(defaultAccessoryNode.key);

        if (rootTreeCtx.selectType === "radio") {
          break;
        }
      } else {
        avatarTreeCtx[nodeKey] = {};

        buildAvatarTree(
          {
            defaultAccessoryTreeCtx: _.get(
              defaultAccessoryTreeCtx,
              ["nodes", nodeKey],
              {},
            ),
            accessoryTreeCtx: _.get(accessoryTreeCtx, ["nodes", nodeKey], {}),
            rootTreeCtx: _.get(rootTreeCtx, ["nodes", nodeKey], {}),
            avatarTreeCtx: avatarTreeCtx[nodeKey],
            avatarAccessorieKeysRef,
          },
          ctxLevel + 1,
        );
      }
    }
  }

  if (rootTreeCtx.selectType === "radio") {
    if (Object.keys(avatarTreeCtx).length > 0) {
      return;
    }
  }

  if (ctxLevel > 1) {
    for (var nodeKey of nodeKeys) {
      if (avatarTreeCtx[nodeKey]) {
        continue;
      }

      const recommendAccessoryNode =
        rootTreeCtx.nodes && rootTreeCtx.nodes[nodeKey];

      if (recommendAccessoryNode.type == "accessory") {
        avatarTreeCtx[nodeKey] = {
          key: recommendAccessoryNode.key,
        };
        avatarAccessorieKeysRef.push(recommendAccessoryNode.key);
        break;
      }

      avatarTreeCtx[nodeKey] = {};

      buildAvatarTree(
        {
          defaultAccessoryTreeCtx: {},
          accessoryTreeCtx: _.get(accessoryTreeCtx, ["nodes", nodeKey], {}),
          rootTreeCtx: _.get(rootTreeCtx, ["nodes", nodeKey], {}),
          avatarTreeCtx: avatarTreeCtx[nodeKey],
          avatarAccessorieKeysRef,
        },
        ctxLevel + 1,
      );
    }
  }
}

const defaultAccessoryKeys = [
  "eyes_eyes4_part1_white",
  "eyes_eyes4_part2_black",
  "head_head8_part2_white",
  "head_head8_part1_white",
];

export default ({ accessoryKeys }) => {
  const rootTree = useSelector((state) => state.rootTree);
  const allAccessories = useSelector((state) => state.allAccessories);
  const filterAccessories = (accessories, keys) =>
    accessories.filter(({ key }) => keys.includes(key));

  const defaultAccessoryTree = buildAccessoriesTree(
    filterAccessories(allAccessories, defaultAccessoryKeys),
  );

  const allAccessoriesDict = _.keyBy(allAccessories, "key");

  const accessoryTree = buildAccessoriesTree(
    filterAccessories(allAccessories, accessoryKeys),
  );

  let avatarTree = {};
  let avatarAccessorieKeys = [];

  buildAvatarTree({
    defaultAccessoryTreeCtx: defaultAccessoryTree,
    accessoryTreeCtx: accessoryTree,
    rootTreeCtx: rootTree,
    avatarTreeCtx: avatarTree,
    avatarAccessorieKeysRef: avatarAccessorieKeys,
  });

  const avatarAccessories = _.orderBy(
    avatarAccessorieKeys.map((x) => allAccessoriesDict[x]),
    ["zIndex"],
    ["asc"],
  );

  return (
    <div>
      {avatarAccessories.map((x) => {
        return (
          <img
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: x.zIndex,
            }}
            src={new URL(x.fileKey, import.meta.url)}
            key={x.key}
          />
        );
      })}
    </div>
  );
};
