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
        <el-input v-model="mockJson" style="width: 200px" type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"></el-input>
        <br />
        <el-button @click="toJSON">序列化</el-button>
        <el-button @click="fromJSON">反序列化</el-button>
        <el-button @click="initTree">initTree</el-button>
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
          <el-input v-model="expression" style="width: 200px" type="textarea"
            :autosize="{ minRows: 10, maxRows: 30 }"></el-input>
        </el-row>
        <el-button @click="saveInfo">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Graph, Shape } from "@antv/x6";
import { onMounted, ref } from "vue";
import mockTreeDataResult from "./mock.json";
import Hierarchy from "@antv/hierarchy";
import { Stencil } from '@antv/x6-plugin-stencil';



import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history'


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
    panning: false,
    // 鼠标滚轮行为
    mousewheel: {
      enabled: false,
      minScale: 0.2,
      maxScale: 3,
    },

    // 连线风格
    connecting: {
      allowBlank: false,//是否允许连接到画布空白位置的点，默认为 true。
      allowLoop: false,//是否允许创建循环连线，即边的起始节点和终止节点为同一节点，默认为 true。
      allowNode: false,//是否允许边连接到节点（非节点上的连接桩），默认为 true。
      allowMulti: false,//是否允许在相同的起始节点和终止之间创建多条边，默认为 true。
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

      // 连线过程中自动吸附
      snap: {
        radius: 20,
      },
      // 连接的过程中创建新的边
      createEdge() {
        // return new Shape.Edge({
        //   attrs: {
        //     line: {
        //       stroke: '#A2B1C3',
        //       strokeWidth: 2,
        //       targetMarker: {
        //         name: 'block',
        //         width: 12,
        //         height: 8,
        //       },
        //     },
        //   },
        //   zIndex: 0,
        // })
        return this.createEdge({
          shape: "my-edge",
        })

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
            fill: "#fff",
            stroke: "#5F95FF",
          },
        },
      },
    },
  });
  // #endregion

  // #region 使用插件
  graph
    .use(
      new Transform({
        resizing: false,
        rotating: false,
      }),
    )
    .use(
      new Selection({
        enabled: true,
        rubberband: true,
        showNodeSelectionBox: true,
      }),
    )
    .use(
      new Snapline({
        enabled: true,
      }),
    )
    .use(
      new Keyboard({
        enabled: true,
      }),
    )
    .use(
      new Clipboard({
        enabled: true,
      }),
    )
    .use(
      new History({
        enabled: true,
      }),
    )
  // #endregion

  // 开始{id: 1, }，多个计算节点，

  // #region 初始化 stencil
  const stencil = new Stencil({
    title: "组件库",
    target: graph,
    stencilGraphWidth: 200,
    stencilGraphHeight: 280,
    placeholder: "搜索组件",
    notFoundText: "未找到",
    // collapsable: false,
    search: (cell: any, keyword: any) => {
      if (keyword) return (cell.attr("text/text") as String).includes(keyword);
      return true;
    },
    groups: [
      {
        title: "基础测试库1",
        name: "group1",
      },
      // {
      //   title: "组件测试库2",
      //   name: "group2",
      // },
    ],
    layoutOptions: {
      columns: 1,
      columnWidth: 200,
      dx: 0,
      rowHeight: 55,
      // center: true,
      // columnWidth:
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
  // #endregion

  // #region 控制连接桩显示/隐藏
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
  graph.on("edge:click", ({ edge }: any) => {
    debugger
    edge.attrs.line.stroke = 'ff0000'
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
            r: 3,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              // visibility: "hidden",
            },
          },
        },
      },
      right: {
        position: "right",
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              // visibility: "hidden",
            },
          },
        },
      },
      bottom: {
        position: "bottom",
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              // visibility: "hidden",
            },
          },
        },
      },
      left: {
        position: "left",
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: "#5f95ff",
            strokeWidth: 1,
            fill: "#ffffff",
            style: {
              // visibility: "hidden",
            },
          },
        },
      },
    },
    // items: [{ group: "top" }, { group: "right" }, { group: "bottom" }, { group: "left" }],
  };

  // #region 自定义边
  Graph.registerEdge('my-edge', {
    inherit: 'edge',
    attrs: {
      line: {
        stroke: '#A2B1C3',
        strokeWidth: 2,
        targetMarker: {
          name: 'block',
          width: 12,
          height: 8,
        },
      },

    },
    zIndex: 0,
  }, true)
  Graph.registerNode(
    "custom-rect",
    {
      inherit: 'rect', // 继承于 rect 节点
      width: 120,
      height: 40,
      markup: [
        {
          tagName: 'rect', // 标签名称
          selector: 'body', // 选择器
        },
        {
          tagName: 'image',
          selector: 'img',
        },
        {
          tagName: 'text',
          selector: 'label',
        },
      ],
      attrs: {
        body: {
          stroke: '#8f8f8f',
          strokeWidth: 1,
          fill: '#fff',
          rx: 20,
          ry: 20,
        },
        img: {
          'xlink:href':
            'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
          width: 16,
          height: 16,
          x: 12,
          y: 12,
        },
      },

      ports: {
        ...ports,
        items: [
          {
            group: "top",
            id: 'port1',
          },
          {
            group: "bottom",
            id: 'port3',
          },
        ],
      },


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
      ports: {
        ...ports,
      },
    },
    true
  );

  const r1 = graph.createNode({
    shape: "custom-circle",
    label: "开始",
    data: {
      type: 3,
      name: "开始节点",
    },
    ports: {
      items: [
        {
          id: 'port3',
          group: 'bottom',
        },

      ],
    },
  });
  const r2 = graph.createNode({
    shape: "custom-rect",
    label: "过程1",
    data: {
      type: 2,
      name: "计算节点",
      expression: "",
    },

    attrs: {

      img: {
        'xlink:href':
          'https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*RXnuTpQ22xkAAAAAAAAAAAAADtOHAQ/original',

      },
    },
  });
  const r3 = graph.createNode({
    shape: "custom-rect",

    label: "过程2",
    data: {
      type: 2,
      name: "计算节点",
      expression: "",
    },
    ports: {
      items: [
        {
          group: 'bottom',
        },
        {
          group: 'top',
        },

      ],
    },
  });
  // const r4 = graph.createNode({
  //   shape: "custom-polygon",
  //   attrs: {
  //     body: {
  //       refPoints: "0,10 10,0 20,10 10,20",
  //     },
  //   },
  //   label: "过程3",
  //   data: {
  //     type: 1,
  //     name: "计算节点",
  //   },
  // });
  // const r5 = graph.createNode({
  //   shape: "custom-polygon",
  //   attrs: {
  //     body: {
  //       refPoints: "10,0 40,0 30,20 0,20",
  //     },
  //   },
  //   label: "其他节点",
  // });
  const r6 = graph.createNode({
    shape: "custom-circle",
    label: "结束",
    data: {
      type: 3,
      name: "结束节点",
    },
    ports: {
      items: [
        {
          id: 'port1',
          group: 'top',
        },

      ],
    },
  });
  stencil.load([r1, r2, r3, r6], "group1");//r4, r5,
  // #endregion

  graph.fromJSON(data);
  bindEvents();
};

const data = { "cells": [{ "shape": "edge", "attrs": { "line": { "stroke": "#A2B1C3", "targetMarker": { "name": "block", "width": 12, "height": 8 } } }, "id": "21077889-bb97-4f6d-9fbf-d75cc48634a1", "zIndex": 0, "source": { "cell": "36dbe407-fc7c-42df-8ed3-7cfbbe62ac21", "port": "154b402b-d6ca-4aad-b6e7-3ca130a8f5b2" }, "target": { "cell": "58847214-b521-4f8a-b17e-5a11f8cf0abb", "port": "82790483-00b6-429b-a82a-2c53ff7972c0" } }, { "shape": "edge", "attrs": { "line": { "stroke": "#A2B1C3", "targetMarker": { "name": "block", "width": 12, "height": 8 } } }, "id": "12f70b77-269d-44b5-8311-f17161de554f", "zIndex": 0, "source": { "cell": "58847214-b521-4f8a-b17e-5a11f8cf0abb", "port": "c08eab2b-12fa-4c5c-a669-d88dbd5488ad" }, "target": { "cell": "bac63e8e-863a-4fb3-9bb2-da1fc73ad351", "port": "00a9bfab-9a22-4ca3-8ccb-55f4a4eb2dc9" } }, { "shape": "edge", "attrs": { "line": { "stroke": "#A2B1C3", "targetMarker": { "name": "block", "width": 12, "height": 8 } } }, "id": "e4d4aa99-53bd-4b74-a401-40a234742252", "zIndex": 0, "source": { "cell": "bac63e8e-863a-4fb3-9bb2-da1fc73ad351", "port": "ee77b72e-99d7-4e9a-9a55-e7b4fdc2a98b" }, "target": { "cell": "080665f4-15b7-425f-9945-75fad0ea59ed", "port": "73ef7997-1aa9-4be8-9d82-d9a8011558d5" } }, { "position": { "x": 430, "y": 118 }, "size": { "width": 45, "height": 45 }, "attrs": { "text": { "text": "开始" } }, "visible": true, "shape": "custom-circle", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "bottom", "id": "154b402b-d6ca-4aad-b6e7-3ca130a8f5b2" }] }, "id": "36dbe407-fc7c-42df-8ed3-7cfbbe62ac21", "data": { "type": 3, "name": "开始节点" }, "zIndex": 3 }, { "position": { "x": 450, "y": 400 }, "size": { "width": 45, "height": 45 }, "attrs": { "text": { "text": "结束" } }, "visible": true, "shape": "custom-circle", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "top", "id": "73ef7997-1aa9-4be8-9d82-d9a8011558d5" }] }, "id": "080665f4-15b7-425f-9945-75fad0ea59ed", "data": { "type": 3, "name": "结束节点" }, "zIndex": 4 }, { "position": { "x": 310, "y": 240 }, "size": { "width": 120, "height": 40 }, "attrs": { "text": { "text": "过程1" }, "img": { "xlink:href": "https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*RXnuTpQ22xkAAAAAAAAAAAAADtOHAQ/original" } }, "visible": true, "shape": "custom-rect", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "bottom", "id": "c08eab2b-12fa-4c5c-a669-d88dbd5488ad" }, { "group": "top", "id": "82790483-00b6-429b-a82a-2c53ff7972c0" }] }, "id": "58847214-b521-4f8a-b17e-5a11f8cf0abb", "data": { "type": 2, "name": "计算节点", "expression": "" }, "zIndex": 5 }, { "position": { "x": 460, "y": 320 }, "size": { "width": 120, "height": 40 }, "attrs": { "text": { "text": "过程2" } }, "visible": true, "shape": "custom-rect", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "bottom", "id": "ee77b72e-99d7-4e9a-9a55-e7b4fdc2a98b" }, { "group": "top", "id": "00a9bfab-9a22-4ca3-8ccb-55f4a4eb2dc9" }] }, "id": "bac63e8e-863a-4fb3-9bb2-da1fc73ad351", "data": { "type": 2, "name": "计算节点", "expression": "" }, "zIndex": 6 }] };

const bindEvents = () => {
  graph.on("node:click", ({ node }: any) => {
    // console.log("e", e);
    // console.log("x", x);
    // console.log("y", y);
    console.log("node", node.data);
    if (node.data) {
      console.log(node.data)
      // type.value = node.data.showConf.nodeType;
      // name.value = node.data.showConf.labelName;
      // expression.value = node.data.showConf.confField;
    }
  });
  graph.on("blank:click", () => {
    type.value = "";
    name.value = "";
    expression.value = "";
  });
  // graph.on("edge:mouseenter", ({ edge }: any) => {
  //   // edge.
  // });
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
  // let graphObj = { "cells": [{ "shape": "edge", "attrs": { "line": { "stroke": "#A2B1C3", "targetMarker": { "name": "block", "width": 12, "height": 8 } } }, "id": "fcd1d651-fedb-4d3d-bfdf-00209861718e", "zIndex": 0, "source": { "cell": "07a292af-75c8-4351-93cc-5ccc456efbf0", "port": "12fca000-ba16-426d-a04b-b81635689ca4" }, "target": { "cell": "3cc53174-9b7f-4ce1-833c-c81cbfe99e01", "port": "6b8d2cb1-5751-47ba-8d8e-a509cb224593" } }, { "shape": "edge", "attrs": { "line": { "stroke": "#A2B1C3", "targetMarker": { "name": "block", "width": 12, "height": 8 } } }, "id": "23210c9c-d31f-4a8f-b7c4-6ee4dbd41885", "zIndex": 0, "source": { "cell": "36dbe407-fc7c-42df-8ed3-7cfbbe62ac21", "port": "154b402b-d6ca-4aad-b6e7-3ca130a8f5b2" }, "target": { "cell": "07a292af-75c8-4351-93cc-5ccc456efbf0", "port": "4283b385-11b7-4c5a-8165-e2e9cba8e2db" } }, { "shape": "edge", "attrs": { "line": { "stroke": "#A2B1C3", "targetMarker": { "name": "block", "width": 12, "height": 8 } } }, "id": "47dbce90-77fe-456e-b144-1235b9deec76", "zIndex": 0, "source": { "cell": "3cc53174-9b7f-4ce1-833c-c81cbfe99e01", "port": "80a68398-9040-4cbc-9239-f243207ea309" }, "target": { "cell": "080665f4-15b7-425f-9945-75fad0ea59ed", "port": "73ef7997-1aa9-4be8-9d82-d9a8011558d5" } }, { "position": { "x": 392.5, "y": 310 }, "size": { "width": 120, "height": 40 }, "attrs": { "text": { "text": "过程2" }, "body": { "rx": 12, "ry": 12 } }, "visible": true, "shape": "custom-rect", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "bottom", "id": "80a68398-9040-4cbc-9239-f243207ea309" }, { "group": "top", "id": "6b8d2cb1-5751-47ba-8d8e-a509cb224593" }] }, "id": "3cc53174-9b7f-4ce1-833c-c81cbfe99e01", "data": { "type": 2, "name": "计算节点", "expression": "" }, "zIndex": 1 }, { "position": { "x": 392.5, "y": 220 }, "size": { "width": 120, "height": 40 }, "attrs": { "text": { "text": "过程1" } }, "visible": true, "shape": "custom-rect", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "bottom", "id": "12fca000-ba16-426d-a04b-b81635689ca4" }, { "group": "top", "id": "4283b385-11b7-4c5a-8165-e2e9cba8e2db" }] }, "id": "07a292af-75c8-4351-93cc-5ccc456efbf0", "data": { "type": 2, "name": "计算节点", "expression": "" }, "zIndex": 2 }, { "position": { "x": 430, "y": 118 }, "size": { "width": 45, "height": 45 }, "attrs": { "text": { "text": "开始" } }, "visible": true, "shape": "custom-circle", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "bottom", "id": "154b402b-d6ca-4aad-b6e7-3ca130a8f5b2" }] }, "id": "36dbe407-fc7c-42df-8ed3-7cfbbe62ac21", "data": { "type": 3, "name": "开始节点" }, "zIndex": 3 }, { "position": { "x": 450, "y": 400 }, "size": { "width": 45, "height": 45 }, "attrs": { "text": { "text": "结束" } }, "visible": true, "shape": "custom-circle", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "top", "id": "73ef7997-1aa9-4be8-9d82-d9a8011558d5" }] }, "id": "080665f4-15b7-425f-9945-75fad0ea59ed", "data": { "type": 3, "name": "结束节点" }, "zIndex": 4 }, { "position": { "x": 182, "y": 180 }, "size": { "width": 120, "height": 40 }, "attrs": { "text": { "text": "过程1" }, "img": { "xlink:href": "https://mdn.alipayobjects.com/huamei_f4t1bn/afts/img/A*RXnuTpQ22xkAAAAAAAAAAAAADtOHAQ/original" } }, "visible": true, "shape": "custom-rect", "ports": { "groups": { "top": { "position": "top", "attrs": { "circle": { "magnet": true, "r": 3 } } }, "bottom": { "position": "bottom", "attrs": { "circle": { "magnet": true, "r": 3 } } } }, "items": [{ "group": "bottom", "id": "6c8c18de-2740-40cf-8723-e47c7e2b096d" }, { "group": "top", "id": "492fe34e-827d-4459-8b95-44b6d749eaf2" }] }, "id": "4ba52f6f-407a-4bcc-b582-d0ea55e8ae24", "data": { "type": 2, "name": "计算节点", "expression": "" }, "zIndex": 5 }] };
  let graphObj = [
    {
      id: "node1",
      x: 40,
      y: 40,

      label: "Hello1",
      shape: "custom-rect",

    },
    {
      id: "node2",
      x: 140,
      y: 140,

      label: "Hello2",
      shape: "custom-rect",
    },

  ]
    ;
  graph.fromJSON(graphObj);

  graph.addEdge({
    shape: "my-edge",
    source: {
      cell: 'node1',
      port: 'port3'
    },
    target: {
      cell: 'node2',
      port: 'port1'
    },
  })
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

/**
 * 导入树形结构数据测试
 */
console.log("mockTreeDataResult", mockTreeDataResult);
// 将 ice 数据结构里的 forward 添加到 children 里
const forwardToChildren = (detailsData: any) => {
  if (detailsData) {
    const { root = <any>[] } = detailsData || {};
    const createTreeData = (data: any[] = []): any => {
      if (data.length === 0) {
        return [];
      }
      return data.map((da: any) => {
        const daItem = { ...da };
        const children = daItem.children ? [...daItem.children] : [];
        if (daItem.forward) {
          children.unshift({ ...daItem.forward, isNotChildren: true });
        }
        daItem.children = children;
        return {
          ...daItem,
          children: createTreeData(daItem.children),
        };
      });
    };
    if (!root.children) root.children = [];
    const rootChildren = root.forward ? [{ ...root.forward, isNotChildren: true }, ...root.children] : [...root.children];
    return {
      ...root,
      children: createTreeData(rootChildren),
    };
  } else {
    return {
      children: [],
      showConf: {},
    };
  }
};
const mockTreeData = forwardToChildren(mockTreeDataResult.data);

const mockJson = ref("");
let treeData = ref<any>();
const initTree = () => {
  if (mockJson.value) {
    treeData.value = forwardToChildren(JSON.parse(mockJson.value).data);
    layoutTree();
    return;
  }
  treeData.value = mockTreeData || {
    id: "" + new Date().getTime(),
    children: [],
    type: 1,
    data: {
      name: "初始化",
      height: 40,
    },
  };

  layoutTree();
};
const layoutTree = () => {
  console.log("treeData", treeData.value);

  const result = Hierarchy.mindmap(treeData.value, {
    direction: "H",
    getId: function getId(d: any) {
      return d.id;
    },
    getVGap: function getVGap() {
      return 20;
    },
    getHGap: function getHGap() {
      return 200;
    },
    getSide: () => "right",
  });

  console.log("result", result);

  const model = { nodes: <any>[], edges: <any>[] };
  // 将树形结构转为平级结构
  const traverse = (data: any) => {
    if (data) {
      model.nodes.push({
        id: data.data.showConf.nodeId,
        x: data.x + 700,
        y: data.y + 200,
        shape: "rect",
        label: data.data.showConf.labelName,
        data: data.data,
        width: 300,
        height: 40,
        ports: {
          groups: {
            left: {
              position: "left",
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: "skyblue",
                  strokeWidth: 2,
                  fill: "#ffffff",
                  // stroke: "transparent",
                  // strokeWidth: 0,
                  // fill: "transparent",
                },
              },
            },
            right: {
              position: "right",
              attrs: {
                circle: {
                  r: 6,
                  magnet: true,
                  stroke: "gray",
                  strokeWidth: 2,
                  fill: "#ffffff",
                },
              },
            },
          },
          items: [
            {
              id: `left-${data.data.showConf.nodeId}`,
              group: "left", // 指定分组名称
            },
            {
              id: `right-${data.data.showConf.nodeId}`,
              group: "right", // 指定分组名称
            },
          ],
        },
      });
    }
    if (data.children) {
      data.children.forEach((item: any) => {
        model.edges.push({
          source: { cell: data.data.showConf.nodeId, port: "right-" + data.data.showConf.nodeId },
          target: { cell: item.data.showConf.nodeId, port: "left-" + item.data.showConf.nodeId },
          shape: "edge",
          attrs: {
            line: {
              stroke: "#A2B1C3",
              targetMarker: {
                height: 8,
                width: 12,
                name: "block",
              },
            },
          },
        });
        traverse(item);
      });
    }
  };
  traverse(result);
  console.log("model", model);
  graph.fromJSON(model);
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
