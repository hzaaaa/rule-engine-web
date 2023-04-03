<template>
  <div class="x6">
    <div class="left">
      <div id="stencil"></div>
    </div>
    <div class="middle">
      <div id="container"></div>
    </div>
    <div class="right">
      <div id="form">
        <el-button @click="toJSON">序列化</el-button>
        <el-button @click="fromJSON">反序列化</el-button>
        <el-row style="margin-top: 20px">
          <div class="label">节点类型：</div>
          <el-select disabled v-model="type" style="margin-right: 12px; width: 200px">
            <el-option v-for="t in typeList" :key="t.type" :value="t.type" :label="t.label"></el-option>
          </el-select>
        </el-row>
        <el-row>
          <div class="label">名称：</div>
          <el-input v-model="name" style="width: 200px"></el-input>
        </el-row>
        <el-row>
          <div class="label">表达式：</div>
          <el-input v-model="expression" style="width: 200px"></el-input>
        </el-row>
        <el-button @click="saveInfo">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Graph, Shape, Addon } from "@antv/x6";
import { onMounted, ref } from "vue";

let graph: any = null;
let container: any = null;
const initGraph = (data: any) => {
  console.log("data", data);

  container = document.getElementById("container");
  const width = container?.scrollWidth;
  const height = container?.scrollHeight || 500;
  // #region 初始化画布
  graph = new Graph({
    container,
    width,
    height,
    // 是否开启网格
    grid: true,
    // 鼠标滚轮行为
    mousewheel: {
      enabled: true,
      minScale: 0.5,
      maxScale: 3,
    },
    // 连线风格
    connecting: {
      router: {
        name: "manhattan",
        args: {
          padding: 10,
        },
      },
      connector: {
        name: "rounded",
        args: {
          radius: 8,
        },
      },
      anchor: "center",
      connectionPoint: "anchor",
      allowBlank: false,
      // 连线过程中自动吸附
      snap: {
        radius: 20,
      },
      // 连接的过程中创建新的边
      createEdge() {
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: "#A2B1C3",
              strokeWidth: 2,
              // 箭头
              targetMarker: {
                name: "block",
                width: 12,
                height: 8,
              },
            },
          },
          zIndex: 0,
        });
      },
      // 在移动边的时候判断连接是否有效
      validateConnection({ targetMagnet }) {
        return !!targetMagnet;
      },
    },
    // 吸附时高亮
    highlighting: {
      magnetAdsorbed: {
        name: "stroke",
        args: {
          attrs: {
            fill: "#5F95FF",
            stroke: "#5F95FF",
          },
        },
      },
    },
    resizing: true,
    rotating: true,
    selecting: {
      enabled: true,
      rubberband: true,
      showNodeSelectionBox: true,
    },
    snapline: true,
    keyboard: true,
    clipboard: true,
  });
  // #endregion

  // 开始{id: 1, }，多个计算节点，

  // #region 初始化 stencil
  const stencil = new Addon.Stencil({
    title: "组件库",
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 280,
    placeholder: "搜索组件",
    notFoundText: "未找到",
    // collapsable: false,
    search: (cell, keyword) => {
      if (keyword) return (cell.attr("text/text") as String).includes(keyword);
      return true;
    },
    groups: [
      {
        title: "基础测试库1",
        name: "group1",
      },
      {
        title: "组件测试库2",
        name: "group2",
      },
    ],
    layoutOptions: {
      columns: 2,
      columnWidth: 80,
      rowHeight: 55,
    },
  });
  document.getElementById("stencil")!.appendChild(stencil.container);
  // #endregion

  // #region 快捷键与事件
  // copy and paste
  graph.bindKey(["meta+c", "ctrl+c"], () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.copy(cells);
    }
  });
  graph.bindKey(["meta+x", "ctrl+x"], () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.cut(cells);
    }
  });
  graph.bindKey(["meta+v", "ctrl+v"], () => {
    if (!graph.isClipboardEmpty()) {
      const cells = graph.paste({ offset: 32 });
      graph.cleanSelection();
      graph.select(cells);
    }
  });

  //undo redo
  graph.bindKey(["meta+z", "ctrl+z"], () => {
    if (graph.history.canUndo()) {
      graph.history.undo();
    }
  });
  graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
    if (graph.history.canRedo()) {
      graph.history.redo();
    }
  });

  //delete
  graph.bindKey("backspace", () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  });
  graph.bindKey("delete", () => {
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  });

  // 控制连接桩显示/隐藏
  const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
    for (let i = 0, len = ports.length; i < len; i++) {
      ports[i].style.visibility = show ? "visible" : "hidden";
    }
  };
  graph.on("node:mouseenter", () => {
    const container = document.getElementById("container")!;
    const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>;
    showPorts(ports, true);
  });
  graph.on("node:mouseleave", () => {
    const container = document.getElementById("container")!;
    const ports = container.querySelectorAll(".x6-port-body") as NodeListOf<SVGElement>;
    showPorts(ports, false);
  });
  // #endregion

  // #region 初始化图形
  // 连接桩
  const ports = {
    groups: {
      top: {
        position: "top",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      right: {
        position: "right",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      bottom: {
        position: "bottom",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
      left: {
        position: "left",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              visibility: "hidden",
            },
          },
        },
      },
    },
    items: [{ group: "top" }, { group: "right" }, { group: "bottom" }, { group: "left" }],
  };

  Graph.registerNode(
    "custom-rect",
    {
      inherit: "rect",
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5f95ff",
          fill: "#eff4ff",
        },
        text: {
          fontSize: 12,
          fill: "#333333",
        },
      },
      ports: { ...ports },
    },
    true
  );
  Graph.registerNode(
    "custom-polygon",
    {
      inherit: "polygon",
      width: 66,
      height: 36,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: {
        ...ports,
        items: [
          {
            group: "top",
          },
          {
            group: "bottom",
          },
        ],
      },
    },
    true
  );
  Graph.registerNode(
    "custom-circle",
    {
      inherit: "circle",
      width: 45,
      height: 45,
      attrs: {
        body: {
          strokeWidth: 1,
          stroke: "#5F95FF",
          fill: "#EFF4FF",
        },
        text: {
          fontSize: 12,
          fill: "#262626",
        },
      },
      ports: { ...ports },
    },
    true
  );

  const r1 = graph.createNode({
    shape: "custom-rect",
    label: "开始",
    attrs: {
      body: {
        rx: 20,
        ry: 26,
      },
    },
  });
  const r2 = graph.createNode({
    shape: "custom-rect",
    label: "过程",
  });
  const r3 = graph.createNode({
    shape: "custom-rect",
    attrs: {
      body: {
        rx: 6,
        ry: 6,
      },
    },
    label: "计算",
    data: {
      type: 2,
      name: "计算节点",
      expression: "",
    },
  });
  const r4 = graph.createNode({
    shape: "custom-polygon",
    attrs: {
      body: {
        refPoints: "0,10 10,0 20,10 10,20",
      },
    },
    label: "决策",
    data: {
      type: 1,
      name: "决策节点",
    },
  });
  const r5 = graph.createNode({
    shape: "custom-polygon",
    attrs: {
      body: {
        refPoints: "10,0 40,0 30,20 0,20",
      },
    },
    label: "数据",
  });
  const r6 = graph.createNode({
    shape: "custom-circle",
    label: "连接",
    data: {
      type: 3,
      name: "连接节点",
    },
  });
  stencil.load([r1, r2, r3, r4, r5, r6], "group1");
  // #endregion

  // graph.fromJSON(data);
  bindEvents();
};

const data = {
  // 节点
  nodes: [
    {
      id: "node1", // String，可选，节点的唯一标识
      x: 40, // Number，必选，节点位置的 x 值
      y: 40, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "hello", // String，节点标签
    },
    {
      id: "node2", // String，节点的唯一标识
      x: 160, // Number，必选，节点位置的 x 值
      y: 180, // Number，必选，节点位置的 y 值
      width: 80, // Number，可选，节点大小的 width 值
      height: 40, // Number，可选，节点大小的 height 值
      label: "world", // String，节点标签
    },
  ],
  // 边
  edges: [
    {
      source: "node1", // String，必须，起始节点 id
      target: "node2", // String，必须，目标节点 id
    },
  ],
};

const bindEvents = () => {
  graph.on("node:click", ({ e, x, y, node }: any) => {
    console.log("e", e);
    console.log("x", x);
    console.log("y", y);
    console.log("node", node.data);
    if (node.data) {
      type.value = node.data.type;
      name.value = node.data.name;
      expression.value = node.data.expression;
    }
  });
  graph.on("blank:click", () => {
    type.value = "";
    name.value = "";
    expression.value = "";
  });
};

const refreshGraph = () => {
  initGraph(data);
};

onMounted(() => {
  refreshGraph();
});

// 序列化 反序列化
const toJSON = () => {
  console.log("toJSON", graph.toJSON());
  console.log("\n", JSON.stringify(graph.toJSON()));
};
const fromJSON = () => {
  let obj = {
    cells: [
      {
        shape: "edge",
        attrs: { line: { stroke: "#A2B1C3", targetMarker: { name: "block", width: 12, height: 8 } } },
        id: "f88d5d55-4fa0-48cf-a864-6d3e9eda78f2",
        zIndex: 0,
        source: { cell: "a64da3ea-72f7-4c3d-b397-fdba16f4b08c", port: "96990c84-279f-43b2-9f1e-66f45d899841" },
        target: { cell: "0245b296-1dd8-4476-b46f-00988a4cc4be", port: "526646e1-fd26-46db-9521-a23e86e5927a" },
      },
      {
        shape: "edge",
        attrs: { line: { stroke: "#A2B1C3", targetMarker: { name: "block", width: 12, height: 8 } } },
        id: "f66390fc-eab7-49e7-8828-e3997d9bed47",
        zIndex: 0,
        source: { cell: "a64da3ea-72f7-4c3d-b397-fdba16f4b08c", port: "96990c84-279f-43b2-9f1e-66f45d899841" },
        target: { cell: "dbb93ed2-447c-41df-b61b-a35edd0d8935", port: "526646e1-fd26-46db-9521-a23e86e5927a" },
      },
      {
        position: { x: 190, y: 160 },
        size: { width: 66, height: 36 },
        attrs: { text: { text: "决策" }, body: { refPoints: "0,10 10,0 20,10 10,20" } },
        visible: true,
        shape: "custom-polygon",
        ports: {
          groups: {
            top: {
              position: "top",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            right: {
              position: "right",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            bottom: {
              position: "bottom",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            left: {
              position: "left",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
          },
          items: [
            { group: "top", id: "4ccb1478-8884-4b10-ba72-55ad7146b38f" },
            { group: "bottom", id: "96990c84-279f-43b2-9f1e-66f45d899841" },
          ],
        },
        id: "a64da3ea-72f7-4c3d-b397-fdba16f4b08c",
        data: { type: 1, name: "决策节点" },
        zIndex: 1,
      },
      {
        position: { x: 124, y: 236 },
        size: { width: 66, height: 36 },
        attrs: { text: { text: "计算" }, body: { rx: 6, ry: 6 } },
        visible: true,
        shape: "custom-rect",
        ports: {
          groups: {
            top: {
              position: "top",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            right: {
              position: "right",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            bottom: {
              position: "bottom",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            left: {
              position: "left",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
          },
          items: [
            { group: "top", id: "526646e1-fd26-46db-9521-a23e86e5927a" },
            { group: "right", id: "85ca2adb-565c-40ad-9a55-066d40186802" },
            { group: "bottom", id: "9b3a06e5-b04e-49ca-a96b-911589b9a4c6" },
            { group: "left", id: "add769e5-e60d-423d-9e5b-984ca5ed7cf6" },
          ],
        },
        id: "0245b296-1dd8-4476-b46f-00988a4cc4be",
        data: { type: 2, name: "计算节点1", expression: "x=1" },
        zIndex: 2,
      },
      {
        position: { x: 256, y: 236 },
        size: { width: 66, height: 36 },
        attrs: { text: { text: "计算" }, body: { rx: 6, ry: 6 } },
        visible: true,
        shape: "custom-rect",
        ports: {
          groups: {
            top: {
              position: "top",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            right: {
              position: "right",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            bottom: {
              position: "bottom",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
            left: {
              position: "left",
              attrs: {
                circle: {
                  r: 4,
                  magnet: true,
                  stroke: "#5f95ff",
                  strokeWidth: 1,
                  fill: "#ffffff",
                  style: { visibility: "hidden" },
                },
              },
            },
          },
          items: [
            { group: "top", id: "526646e1-fd26-46db-9521-a23e86e5927a" },
            { group: "right", id: "85ca2adb-565c-40ad-9a55-066d40186802" },
            { group: "bottom", id: "9b3a06e5-b04e-49ca-a96b-911589b9a4c6" },
            { group: "left", id: "add769e5-e60d-423d-9e5b-984ca5ed7cf6" },
          ],
        },
        id: "dbb93ed2-447c-41df-b61b-a35edd0d8935",
        data: { type: 2, name: "计算节点2", expression: "y=2" },
        zIndex: 3,
      },
    ],
  };
  console.log("fromJSON", graph.fromJSON(obj));
};

const type = ref("");
const typeList = [
  { label: "决策节点", type: 1 },
  { label: "计算节点", type: 2 },
  { label: "连接节点", type: 3 },
];
const name = ref("");
const expression = ref("");
const saveInfo = () => {
  // console.log("saveInfo", (graph.getSelectedCells()[0].data = { expression }));
  graph.getSelectedCells()[0].data = {
    type: type.value,
    name: name.value,
    expression: expression.value,
  };
};
</script>

<style scoped lang="scss">
.x6 {
  display: flex;
  height: 100%;
  .left {
    flex-shrink: 0;
    width: 200px;
    #stencil {
      position: relative;
      border-right: 1px solid #dddddd;
      width: 200px;
      height: 100%;
    }
  }
  .middle {
    flex-grow: 1;
  }
  .right {
    width: 300px;
  }
}
#container {
  height: 100%;
}
</style>
