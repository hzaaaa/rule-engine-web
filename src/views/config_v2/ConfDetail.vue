<template>
  <div class="detail">
    <!-- 按钮区 -->
    <div class="btn">
      <el-button @click="router.back()">返回</el-button>
      <el-button type="primary" @click="release">发布</el-button>
      <el-button type="danger" @click="confUpdateClean">清除</el-button>
      <!-- <el-button @click="importJson">导入</el-button>
      <el-button @click="exportJson">导出</el-button>
      <el-button @click="downloadImage">下载图片</el-button> -->
    </div>
    <div class="box">
      <!-- 节点详情区 -->
      <div class="left">
        <div class="info">
          <h4>节点信息</h4>
          <el-row v-if="currentNodeConf">
            <div class="label">节点ID：</div>
            <div>{{ currentNodeConf.nodeId }}</div>
          </el-row>
          <el-row v-if="currentNodeConf">
            <div class="label">节点名称：</div>
            <div>{{ currentNodeConf.nodeName }}</div>
          </el-row>
          <el-row v-if="currentNodeConf">
            <div class="label">节点类型：</div>
            <div>{{ currentNodeConf.nodeType }}</div>
          </el-row>
          <!-- <el-row v-if="currentNodeConf?.confField">
            <div class="label">配置JSON：</div>
            <el-input v-model="currentNodeConf.confField" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"></el-input>
          </el-row> -->
        </div>
        <div class="operation">
          <div v-if="isOperationButtonsVisible" class="operation-btns">
            <el-button @click="showAddNodeModel('child')" :disabled="!currentNodeModel" round>添加子节点</el-button>
            <!-- <el-button @click="showAddNodeModel('child')" v-if="!isCurrentLeafNode" :disabled="!currentNodeModel" round
              >添加子节点</el-button
            > -->
            <!-- <el-button @click="showAddNodeModel('front')" v-if="!currentNodeModel?.forward" :disabled="!currentNodeModel" round
              >添加前置节点</el-button
            >
            <el-button @click="showAddNodeModel('exchange')" :disabled="!currentNodeModel" round>节点转换</el-button> -->
            <el-button @click="deleteCurrentNode" :disabled="!currentNodeModel" round plain type="danger">删除本节点</el-button>
          </div>
          <div v-else>
            <h4>{{ operationTitle }}</h4>
            <el-scrollbar style="height: calc(100% - 48px)">
              <el-row>
                <div class="label">名称：</div>
                <el-input v-model="addNodeModelForm.name"></el-input>
              </el-row>
              <el-row>
                <div class="label">节点类型：</div>
                <el-select v-model="addNodeModelForm.nodeType" @change="onNodeTypeChangeNew" style="width: 100%">
                  <el-option
                    v-for="nodeType in nodeTypeList"
                    :key="nodeType.id"
                    :label="nodeType.name"
                    :value="nodeType.id"
                  ></el-option>
                </el-select>
              </el-row>
              <el-row v-if="selectedNodeType === 1">
                <div class="label">relationType：</div>
                <el-select v-model="addNodeModelForm.relationType" style="width: 100%">
                  <el-option
                    v-for="relationType in relationTypeList"
                    :key="relationType.id"
                    :label="relationType.name"
                    :value="relationType.id"
                  ></el-option>
                </el-select>
              </el-row>
              <el-row v-if="selectedNodeType !== 1 && selectedNodeType !== 13">
                <div class="label">算子类型：</div>
                <el-select v-model="addNodeModelForm.confName" @change="onConfNameChange" style="width: 100%">
                  <el-option
                    v-for="confClass in confClassList"
                    :key="confClass.name"
                    :label="confClass.desc"
                    :value="confClass.clazz"
                  ></el-option>
                </el-select>
              </el-row>
              <el-row v-if="selectedNodeType === 13">
                <div class="label">节点ID(逗号分隔)：</div>
                <el-input v-model="addNodeModelForm.multiplexIds"></el-input>
              </el-row>
              <el-row v-for="field in confFieldsList" :key="field.field">
                <div class="label">{{ `${field.desc}：` }}</div>
                <el-radio-group v-model="dynamicForm[field.field]" v-if="field.type === 'boolean'">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
                <el-input v-model="dynamicForm[field.field]" v-else :placeholder="`请输入 ${field.type} 格式`"></el-input>
              </el-row>
              <el-button @click="cancleAddNodeModel" size="small">取消</el-button>
              <el-button @click="submitAddNodeModel" type="primary" size="small">确定</el-button>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div id="container"></div>
      <!-- 叶子节点区 -->
      <div class="right">
        <el-scrollbar>
          <div v-for="child in childNodes" :key="child.id">
            <el-card class="card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>{{ child.showConf.nodeName }}</span>
                  <div>
                    <el-button type="primary" size="small" v-if="child?.showConf?.confField" @click="submitEditChildNode(child)"
                      >保存</el-button
                    >
                    <el-button type="danger" size="small" @click="deleteChildNode(child)">删除</el-button>
                  </div>
                </div>
              </template>
              <el-row>
                <div class="label">节点ID：</div>
                <div>{{ child.showConf.nodeId }}</div>
              </el-row>
              <el-row>
                <div class="label">节点类型：</div>
                <div>{{ child.showConf.nodeType }}</div>
              </el-row>
              <el-row v-if="child?.showConf?.confField || child?.showConf?.confField === ''" class="jsonbox">
                <div class="label">配置JSON：</div>
                <!-- 第三版 vue-codemirror 编辑器插件，json可格式化，可修改json全文，可自由添加子属性 -->
                <codemirror
                  v-model="child.showConf.confField"
                  :extensions="extensions"
                  @ready="beautifyCurField(child.showConf)"
                />
                <div class="tips">
                  <el-button type="primary" link size="small" @click="copyCurField(child.showConf.confField)"
                    >复制 JSON</el-button
                  >
                  <el-button type="primary" link size="small" @click="beautifyCurField(child.showConf)">美化</el-button>
                </div>
                <!-- 第二版 vue-json-pretty 插件，json可格式化，只可修改value值且新增的子对象也会被识别为字符串 -->
                <!-- <vue-json-pretty v-model:data="child.showConf.confField" editable></vue-json-pretty> -->
                <!-- <el-button type="primary" link size="small" class="tips" @click="copyJSON(child.showConf.confField)"
                  >复制 JSON</el-button
                > -->
                <!-- 第一版 input 框，json无格式化 -->
                <!-- <el-input v-model="child.showConf.confField" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }"></el-input> -->
              </el-row>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
      <!-- 图例 -->
      <div class="legend">
        <div class="legend-title">图例</div>
        <div class="legend-item">
          <div class="legend-item-none"></div>
          <div class="legend-item-notes">根节点</div>
        </div>
        <div class="legend-item">
          <div class="legend-item-oprator"></div>
          <div class="legend-item-notes">操作算子</div>
        </div>
        <div class="legend-item">
          <div class="legend-item-variable"></div>
          <div class="legend-item-notes">变量算子</div>
        </div>
        <div class="legend-item">
          <div class="legend-item-param"></div>
          <div class="legend-item-notes">参数绑定算子</div>
        </div>
      </div>
    </div>

    <!-- 导入 弹窗 -->
    <el-dialog v-model="importVisible" title="导入" @closed="onImportClosed" width="600">
      <el-form :model="importForm">
        <el-form-item label="配置：" label-width="60px">
          <el-input v-model="importForm.json" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button @click="importConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导出 弹窗 -->
    <el-dialog v-model="exportVisible" title="导出" @closed="onExportClosed" width="800">
      <div class="exportData">{{ exportData }}</div>
      <div class="btn-group">
        <el-button @click="onCopy(exportData)">复制配置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { Graph } from "@antv/x6";
import G6 from "@antv/g6";
import {
  getConfDetailApi,
  getConfLeafInfoApi,
  postConfEditApi,
  getConfReleaseApi,
  getConfUpdateCleanApi,
  // getBaseExportApi,
  postBaseImportApi,
} from "@/api/engine/engine_v2";
import { copyTextToClipboard } from "@/utils/util";
// import VueJsonPretty from "vue-json-pretty";
// import "vue-json-pretty/lib/styles.css";
import { Codemirror } from "vue-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";

const route = useRoute();
const router = useRouter();
const { appId, baseId } = route.query;

// console.log("route", route.params, appId, baseId, confId);

/**
 * 操作区
 */
const release = () => {
  getConfReleaseApi({ appId, baseId }).then((res) => {
    if (res.code === 200) {
      ElMessage.success("success");
      refreshGraph();
    } else ElMessage.error(res.msg);
  });
};
const confUpdateClean = () => {
  ElMessageBox.confirm(`确认清除所有变更吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await getConfUpdateCleanApi({
        appId,
        baseId,
      });
      ElMessage.success("success");
      refreshGraph();
    })
    .catch(() => {});
};
// const importJson = () => {
//   importVisible.value = true;
// };
// const exportJson = () => {
//   getBaseExportApi({ appId, baseId }).then((res) => {
//     exportData.value = res.data.data;
//   });
//   exportVisible.value = true;
// };
// const downloadImage = () => {
//   graph.downloadFullImage(undefined, undefined, {
//     backgroundColor: "#eeeeee",
//     padding: 20,
//   });
// };

/**
 * 导入 弹窗
 */
const importVisible = ref(false);
const importForm = reactive({ json: "" });
const importConfirm = () => {
  postBaseImportApi({ json: importForm.json }).then(() => {
    importVisible.value = false;
    refreshGraph();
  });
};
const onImportClosed = () => {
  importForm.json = "";
};

/**
 * 导出 弹窗
 */
const exportVisible = ref(false);
const exportData = ref("");
const onCopy = (text: string) => {
  copyTextToClipboard(text);
  ElMessage.success("复制成功");
  exportVisible.value = false;
};
const onExportClosed = () => {
  exportData.value = "";
};

/**
 * 画布区
 */
const showOperation = ref(false);
const selectedNodeType = ref(14);

let graph: any = null;
let container: any = null;
let createRoot = false;
/**
 * 图例，未生效
 */
/*
const legendData = {
  nodes: [
    {
      id: "type1",
      label: "根节点",
      order: 4,
      // type: "circle",
      // color: "#FFFACD",
      // stroke: "#EEAD0E",
      // size: [30, 30],
      type: "circle",
      size: 5,
      style: {
        fill: "#5B8FF9",
      },
    },
    {
      id: "type2",
      label: "ALL节点",
      order: 3,
      // type: "rect",
      // color: "#aee8f8",
      // stroke: "#2ab5c9",
      // size: [26, 26],
      type: "circle",
      size: 20,
      style: {
        fill: "#5AD8A6",
      },
    },
  ],
};
const legend = new G6.Legend({
  data: legendData,
  align: "center",
  layout: "horizontal", // vertical
  position: "bottom-right",
  title: "图例",
});
*/
const initTree = (treeData: any[]) => {
  if (!graph) {
    container = document.getElementById("container");
    const width = container?.scrollWidth;
    const height = container?.scrollHeight || 500;
    const isFirstPainted = ref(false); // 用于首次加载时高亮根节点
    graph = new G6.TreeGraph({
      container: "container",
      width,
      height,
      autoPaint: true,
      modes: {
        default: [
          /*
          {
            type: "collapse-expand",
            onChange(item: any, collapsed) {
              const icon = item.get("group").find((e: any) => e.get("name") === "collapse-icon");
              icon.attr("symbol", collapsed ? G6.Marker.expand : G6.Marker.collapse);
            },
          },
          */
          "drag-canvas",
          "zoom-canvas",
          // {
          //   type: "activate-relations",
          //   trigger: "click",
          // },
          {
            type: "click-select",
            multiple: false,
          },
        ],
      },
      defaultNode: {
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
        style: {
          cursor: "pointer",
        },
      },
      defaultEdge: {
        type: "cubic-horizontal",
        style: {
          stroke: "#CFCFCF",
          // endArrow: {
          //   path: "M 0,0 L 10,3 L 10,-3 Z",
          //   fill: "#cfcfcf",
          // },
        },
      },
      nodeStateStyles: {
        selected: {
          stroke: "pink",
          lineWidth: 2,
          shadowColor: "pink",
          shadowBlur: 8,
        },
      },
      layout: {
        type: "mindmap",
        direction: "H",
        getId: function getId(d: any) {
          return d.id;
        },
        getVGap: function getVGap() {
          return 10;
        },
        getHGap: function getHGap() {
          return 120;
        },
        getSide: () => "right",
      },
      // plugins: [legend],
    });

    graph.node((node: any) => {
      const { nodeType, labelName } = node.showConf;

      return {
        type: getStyle(nodeType).type,
        label: createRoot ? "ERROR" : `${labelName}`,
        size: getStyle(nodeType).size,
        strokeOpacity: 0.5,
        style: {
          fill: node.isNotChildren ? "#FFCCCC" : getStyle(nodeType).color,
          stroke: node.isNotChildren
            ? nodeType === 8 || nodeType === 9 || nodeType === 10 || nodeType === 11 || nodeType === 12
              ? getStyle(nodeType).stroke
              : "#FF0000"
            : getStyle(nodeType).stroke,
        },
        labelCfg: {
          position: "right",
          style: {
            fontSize: 15,
          },
        },
      };
    });

    graph.data(treeData);
    graph.render();
    if (!isFirstPainted.value) {
      isFirstPainted.value = true;
      const rootNode = graph.find("node", (node: any) => {
        return node.getModel().depth === 0;
      });
      const rootModel = rootNode.getModel();
      // 初始加载时，默认选中根节点
      graph.setItemState(rootNode, "selected", true);
      currentNodeModel.value = rootModel;
      currentNodeConf.value = rootModel.showConf;
      // childNodes.value = [...rootModel.leafNodes, ...rootModel.children];
      childNodes.value = rootModel.children;
    }
    graph.fitView(100);
    bindEvents();
  }
};
// 页面变化后，将 canvas 画布与 container 大小保持一致
if (typeof window !== "undefined") {
  window.onresize = () => {
    if (!graph || graph.get("destroyed")) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };
}
const getStyle = (type: number) => {
  if (type === 0) {
    // 根节点
    return {
      type: "circle",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
  } else if (type === 1) {
    // AND
    return {
      type: "diamond",
      // color: "#F7B7B5",
      // stroke: "#f38f8c",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [31, 31],
    };
  } else if (type === 2) {
    // TRUE
    return {
      type: "diamond",
      // color: "#FFBC95",
      // stroke: "#f79d69",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 20],
    };
  } else if (type === 3) {
    // ALL
    return {
      type: "rect",
      // color: "#aee8f8",
      // stroke: "#2ab5c9",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [26, 26],
    };
  } else if (type === 4) {
    // ANY
    return {
      type: "triangle",
      // color: "#c3ffb8",
      // stroke: "#91d9ba",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [16, 16],
    };
  } else if (type === 5) {
    // FLOW 节点，叶子节点，已不再显示
    return {
      type: "diamond",
      // color: "#C1FFC1",
      // stroke: "#00CD00",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [31, 31],
    };
  } else if (type === 6) {
    // Result 节点，叶子节点，已不再显示
    return {
      type: "rect",
      // color: "#C1FFC1",
      // stroke: "#00CD00",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [26, 26],
    };
  } else if (type === 7) {
    // None 节点，叶子节点已不再显示
    return {
      type: "triangle",
      // color: "#C1FFC1",
      // stroke: "#00CD00",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [16, 16],
    };
  } else if (type === 8) {
    // P_None 节点
    return {
      type: "circle",
      // color: "#C9D8DF",
      // stroke: "#98bccd",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
  } else if (type === 9) {
    // P_AND
    return {
      type: "circle",
      // color: "#B2DEE1",
      // stroke: "#6dacb0",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
  } else if (type === 10) {
    // P_TRUE
    return {
      type: "circle",
      // color: "#F7E6D6",
      // stroke: "#d7bea7",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
  } else if (type === 11) {
    // P_ALL
    return {
      type: "circle",
      // color: "#4CB19C",
      // stroke: "#13878b",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
  } else if (type === 12) {
    // P_ANY
    return {
      type: "circle",
      // color: "#D25B85",
      // stroke: "#d02561",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
  } else if (type === 14) {
    // 操作算子
    return {
      type: "diamond",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [31, 31],
    };
  } else if (type === 15) {
    // 变量算子
    return {
      type: "rect",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [26, 26],
    };
  } else if (type === 16) {
    // 参数绑定算子
    return {
      type: "triangle",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [16, 16],
    };
  } else {
    return {
      type: "circle",
      color: "#DDA0DD",
      stroke: "#9400D3",
      size: [30, 30],
    };
  }
};

const bindEvents = () => {
  // 点击 canvas 空白处，关闭节点操作区
  graph.on("click", (ev: any) => {
    if (!ev.item || ev.item._cfg.type !== "node") showOperation.value = false;
    if (!ev.item || ev.item._cfg.type !== "node") {
      currentNodeModel.value = null;
      currentNodeConf.value = null;
      childNodes.value = [];
      cancleAddNodeModel();
      // graph.getNodes().forEach((node: any) => {
      //   graph.clearItemStates(node);
      // });
    }
  });
  // 左键单击节点时
  graph.on("node:click", (evt: any) => {
    const { item } = evt;
    const model = item.getModel();
    // 切换节点时，需要先清空当前节点信息
    if (model?.showConf?.nodeId !== currentNodeConf?.value?.nodeId) {
      cancleAddNodeModel();
    }
    currentNodeModel.value = model;
    currentNodeConf.value = model.showConf;
    console.log("cur", currentNodeConf.value);

    // childNodes.value = [...model.leafNodes, ...model.children];
    childNodes.value = model.children;
  });
};
const refreshGraph = () => {
  // 每次刷新图后，清空当前节点的信息
  currentNodeConf.value = null;
  currentNodeModel.value = null;
  childNodes.value = [];
  getConfDetailApi({ appId: Number(appId), baseId: Number(baseId), address: "server" }).then((res) => {
    jsonToGraph(res.data);
  });
};
const jsonToGraph = (detailsData: any) => {
  if (detailsData) {
    createRoot = false;
    if (graph && graph.destroy) {
      graph.destroy();
      graph = null;
    }
    const { root = <any>[] } = detailsData || {};
    // console.log("1-root", root);
    /*
    const createTreeData = (data: any[] = []): any => {
      if (data.length === 0) return [];
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
    */
    const filterLeaveAndChildren = (children: any[] = []) => {
      // if (!children.length) return { leafNodes: [], children: [] };
      if (!children.length) return { children: [] };
      // const _leave = <any>[];
      const _children = <any>[];
      children.forEach((child: any) => {
        // if ([5, 6, 7].includes(child.showConf.nodeType)) {
        //   _leave.push({ ...child });
        // } else {
        const childCopy = { ...child };
        const subChildren = childCopy.children ? [...childCopy.children] : [];
        if (childCopy.forward) {
          subChildren.unshift({ ...childCopy.forward, isNotChildren: true });
        }
        const res = filterLeaveAndChildren(subChildren);
        // childCopy.leafNodes = res.leafNodes ?? [];
        childCopy.children = res.children ?? [];
        _children.push(childCopy);
        // }
      });
      // return { leafNodes: _leave, children: _children };
      return { children: _children };
    };

    if (!root.children) root.children = [];
    const rootChildren = root.forward ? [{ ...root.forward, isNotChildren: true }, ...root.children] : [...root.children];

    const res = filterLeaveAndChildren(rootChildren);
    const treeData = {
      ...root,
      // leafNodes: res.leafNodes,
      children: res.children,
    };
    // console.log("2-treeData", treeData);

    // 递归将节点中的任意深度的 showConf 中的 confField 转为对象，用于 vue-json-pretty插件
    /*
    const jsonToObj = (child: any) => {
      if (child.showConf.confField) {
        try {
          child.showConf.confField = JSON.parse(child.showConf.confField);
        } catch (error) {
          console.log(error);
        }
      }
      if (child.children && child.children.length) {
        child.children.forEach((chi: any) => {
          jsonToObj(chi);
        });
      }
      // if (child.leafNodes && child.leafNodes.length) {
      //   child.leafNodes.forEach((chi: any) => {
      //     jsonToObj(chi);
      //   });
      // }
    };
    // treeData.leafNodes.forEach((child: any) => {
    //   jsonToObj(child);
    // });
    treeData.children.forEach((child: any) => {
      jsonToObj(child);
    });
    */
    // console.log("treeData", treeData);

    initTree(treeData);
  } else {
    const emptyTreeData: any = {
      children: [],
      showConf: {},
    };
    createRoot = true;
    initTree(emptyTreeData);
  }
};
onMounted(() => {
  refreshGraph();
});

/**
 * 节点操作区
 */
const nodeTypeList = [
  // { name: "Relation", id: 1 },
  // { name: "Flow", id: 5 },
  // { name: "Result", id: 6 },
  // { name: "None", id: 7 },
  // { name: "节点ID", id: 13 },
  { name: "操作算子", id: 14 },
  { name: "变量算子", id: 15 },
  { name: "参数绑定算子", id: 16 },
];

const relationTypeList = [
  { name: "AND", id: 1 },
  { name: "TRUE", id: 2 },
  { name: "ALL", id: 3 },
  { name: "ANY", id: 4 },
  { name: "NONE", id: 0 },
  // { name: "P_AND", id: 9 },
  // { name: "P_TRUE", id: 10 },
  // { name: "P_ALL", id: 11 },
  // { name: "P_ANY", id: 12 },
  // { name: "P_NONE", id: 8 },
];

const confClassList = ref<any[]>([]);
const confFieldsList = ref<any[]>([]); // 添加节点时的动态输入框列表
const dynamicForm = ref<any>({}); // 添加节点时动态输入框绑定值

const onConfNameChange = (val: any) => {
  confFieldsList.value = confClassList.value.find((conf) => conf.clazz === val)?.fields;
  dynamicForm.value = {};
  confFieldsList.value.forEach((conf) => (dynamicForm.value[conf.field] = ""));
};

/**
 * 节点详情区
 */
const childNodes = ref<any[]>([]); // 展示在右侧子节点区
const isOperationButtonsVisible = ref(true);
const addNodeModelType = ref("child");
const operationTitle = ref("添加子节点");
const addNodeModelFormOrigin = { name: "", nodeType: 14, relationType: 1, confName: "", multiplexIds: "", confField: "" };
const addNodeModelForm = reactive({ name: "", nodeType: 14, relationType: 1, confName: "", multiplexIds: "", confField: "" });

const showAddNodeModel = (type: "child" | "front" | "exchange" = "child") => {
  addNodeModelType.value = type;
  operationTitle.value = type === "child" ? "添加子节点" : type === "front" ? "添加前置节点" : "节点转换";
  isOperationButtonsVisible.value = false;
  selectedNodeType.value = 14;
  if (type === "exchange") {
    // console.log("节点转换\n", currentNodeConf.value);
    addNodeModelForm.name = currentNodeConf.value.nodeName;
    if (currentNodeConf.value.nodeType === 0) {
      addNodeModelForm.nodeType = 14;
      addNodeModelForm.relationType = 7;
    } else {
      addNodeModelForm.nodeType = 14;
      addNodeModelForm.relationType = currentNodeConf.value.nodeType;
    }
  }
  getConfLeafInfoApi({ appId, type: selectedNodeType.value }).then((res) => {
    confClassList.value = res.data;
  });
};
const cancleAddNodeModel = () => {
  addNodeModelType.value = "";
  isOperationButtonsVisible.value = true;
  // 取消时，还原 addNodeModelForm 为初始值，清空变量现有值
  Object.assign(addNodeModelForm, addNodeModelFormOrigin);
  confFieldsList.value.length = 0;
  dynamicForm.value = {};
};
const submitAddNodeModel = () => {
  let params = <any>{
    appId,
    baseId,
    editType: addNodeModelType.value === "child" ? 1 : addNodeModelType.value === "exchange" ? 5 : 4,
    selectId: currentNodeConf.value.nodeId,
  };
  if (currentNodeModel.value.parentId) params.parentId = currentNodeModel.value.parentId;
  if (currentNodeModel.value.nextId) params.nextId = currentNodeModel.value.nextId;
  if (currentNodeModel.value.index) params.index = currentNodeModel.value.index;
  if (addNodeModelForm.name) params.name = addNodeModelForm.name;
  if (addNodeModelForm.nodeType) params.nodeType = addNodeModelForm.nodeType;
  if (addNodeModelForm.confName) params.confName = addNodeModelForm.confName;
  if (Object.keys(dynamicForm.value).length) {
    let res = <any>{};
    Object.keys(dynamicForm.value).forEach((key: any) => {
      if (dynamicForm.value[key] || typeof dynamicForm.value[key] === "boolean") {
        try {
          res[key] = JSON.parse(dynamicForm.value[key]);
        } catch (error) {
          res[key] = dynamicForm.value[key];
        }
      }
    });
    params.confField = JSON.stringify(res);
  }
  // if (addNodeModelForm.nodeType === 5 || addNodeModelForm.nodeType === 6 || addNodeModelForm.nodeType === 7) {
  // }
  if (addNodeModelForm.nodeType === 13) {
    if (addNodeModelForm.multiplexIds) params.multiplexIds = addNodeModelForm.multiplexIds;
  }
  if (params.nodeType === 1) params.nodeType = addNodeModelForm.relationType;

  isOperationButtonsVisible.value = true;

  postConfEditApi(params).then((res) => {
    if (res.code === 200) {
      ElMessage.success("success");
      refreshGraph();
      // 添加结束时，还原 addNodeModelForm 为初始值，清空变量现有值
      Object.assign(addNodeModelForm, addNodeModelFormOrigin);
      confFieldsList.value.length = 0;
      dynamicForm.value = {};
    }
  });
};
const deleteCurrentNode = () => {
  ElMessageBox.confirm(`确认删除<${currentNodeConf.value.labelName}>节点吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await postConfEditApi({
        appId,
        baseId,
        editType: 3,
        selectId: currentNodeConf.value.nodeId,
        parentId: currentNodeModel.value.parentId,
        nextId: currentNodeModel.value.nextId,
        index: currentNodeModel.value.index,
      });
      ElMessage.success("删除成功");
      refreshGraph();
    })
    .catch((err) => {
      console.error("postConfEditApi 错误", err);
    });
};
const onNodeTypeChangeNew = (type: number) => {
  if (type !== selectedNodeType.value) {
    addNodeModelForm.confName = "";
    confFieldsList.value.length = 0;
    dynamicForm.value = {};
  }
  selectedNodeType.value = type;
  if (type !== 1 && type !== 13) {
    getConfLeafInfoApi({ appId, type: selectedNodeType.value }).then((res) => {
      confClassList.value = res.data;
    });
  }
};

/**
 * 叶子节点区
 */
const currentNodeModel = ref<any>(); // 当前节点的 model 信息(包含 conf 信息)
const currentNodeConf = ref<any>(); // 当前节点的 conf 信息
// const consoleChild = (child: any) => {
//   console.log("consoleChild", child);
// };
const submitEditChildNode = (child: any) => {
  let params = <any>{
    appId,
    baseId,
    editType: 2,
    selectId: child.showConf.nodeId,
  };
  if (child.showConf.confField) params.confField = JSON.stringify(JSON.parse(child.showConf.confField));
  postConfEditApi(params).then((res) => {
    if (res.code === 200) {
      ElMessage.success("success");
      refreshGraph();
    }
  });
};
const deleteChildNode = (child: any) => {
  ElMessageBox.confirm(`确认删除<${child.showConf.labelName}>节点吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await postConfEditApi({
        appId,
        baseId,
        editType: 3,
        selectId: child.showConf.nodeId,
        parentId: child.parentId,
        nextId: child.nextId,
        index: child.index,
      });
      ElMessage.success("删除成功");
      refreshGraph();
    })
    .catch((err) => {
      console.error("postConfEditApi 错误", err);
    });
};

/**
 * codemirror 配置
 */
function svg(content: string, attrs = `viewBox="0 0 1024 1024" width="40" height="40"`) {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${attrs}>${encodeURIComponent(content)}</svg>')`;
}
// import "@/assets/images/code-error.svg";
const myTheme = EditorView.theme({
  ".cm-lint-marker-error": {
    // content: svg(`<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>`),
    // content: svg(`<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>`),
    content: svg(
      `<path d="M0 512a512 512 0 1 0 1024 0A512 512 0 0 0 0 512z" fill="#FF4948" p-id="25967"></path><path d="M601.486222 512.796444l177.379556 177.379556a62.691556 62.691556 0 0 1-88.746667 88.689778l-177.322667-177.379556-177.436444 177.379556a62.691556 62.691556 0 0 1-88.632889-88.746667l177.379556-177.322667-177.379556-177.436444a62.691556 62.691556 0 1 1 88.632889-88.632889l177.493333 177.379556 177.322667-177.379556a62.691556 62.691556 0 0 1 88.689778 88.632889l-177.379556 177.493333z" fill="#FFFFFF" p-id="25968"></path>`
    ),
  },
});
const myHighlightStyle = HighlightStyle.define([
  {
    tag: t.string,
    color: "#EC7063", // 2AA198 CE9178
  },
  {
    tag: t.number,
    color: "#28B463", // D33682 B5CEA8 45999B
  },
  {
    tag: [t.keyword, t.operator, t.punctuation],
    color: "#859900", //
  },
  {
    tag: [t.definitionKeyword, t.modifier],
    color: "#073642",
    fontWeight: "bold",
  },
  {
    tag: [t.bool, t.null],
    color: "#2874A6", // B58900 #569CD6
  },
  {
    tag: t.propertyName,
    color: "#5499C7", // 268BD2
  },
]);
const extensions = [json(), lintGutter(), linter(jsonParseLinter()), myTheme, syntaxHighlighting(myHighlightStyle)];
const copyCurField = (jsonstr: string) => {
  let str = "";
  if (jsonstr !== "") {
    str = JSON.stringify(JSON.parse(jsonstr));
  }
  if (navigator.clipboard) {
    // 新api，安全限制较多，https 或 localhost 才可用
    navigator.clipboard.writeText(str);
  } else {
    // 传统api，随时可能会废弃
    const tempInput = document.createElement("input");
    tempInput.setAttribute("value", str);
    document.body.append(tempInput);
    tempInput.select();
    document.execCommand("copy");
    tempInput.remove();
  }
  ElMessage.success("复制成功");
};
const beautifyCurField = (curShowConf: any) => {
  if (curShowConf.confField === "") return; // 当 json 为空字符串时直接返回，避免 format 时 JSON.parse 报错
  curShowConf.confField = formatJsonstr(curShowConf.confField);
};
const formatJsonstr = (jsonstr: string) => {
  return JSON.stringify(JSON.parse(jsonstr), null, 2);
};
// log('ready', $event)
</script>

<style scoped lang="scss">
.detail {
  position: relative;
  height: 100%;
}
.box {
  display: flex;
  position: relative;
  margin-top: 8px;
  height: calc(100% - 40px);
  background-color: #ffffff;
  .left {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 4px;
    border-right: 1px solid #eeeeee;
    width: 20%;
    h4 {
      margin: 0;
      height: 40px;
      line-height: 40px;
    }
    .el-row {
      align-items: center;
      margin-bottom: 4px;
    }
    .label {
      font-size: 14px;
      color: #333333;
    }
    .info {
      flex-shrink: 0;
      padding-bottom: 4px;
      border-bottom: 1px solid #eeeeee;
      min-height: 200px;
    }
    .operation {
      overflow: hidden;
      flex: 1;
      padding-top: 8px;
      &-btns {
        display: flex;
        flex-direction: column;
        button {
          margin-left: 0;
          margin-bottom: 16px;
        }
      }
    }
  }
  .right {
    overflow: hidden;
    flex-shrink: 0;
    padding: 8px;
    border-left: 1px solid #dddddd;
    width: 30%;
    // background-color: #eeeeee;
    .card {
      margin-bottom: 12px;
      background-color: rgb(255 255 255 / 50%);
      font-size: 14px;
      color: #333333;
      &-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-weight: 700;
        }
      }
      :deep(.el-card__header) {
        padding: 8px 10px;
      }
      :deep(.el-card__body) {
        padding: 10px;
      }
      .jsonbox {
        display: flex;
        position: relative;
        flex-direction: column;
        // .vjs-tree {
        //   box-sizing: border-box;
        //   padding: 2px;
        //   border: 1px solid #eeeeee;
        //   border-radius: 8px;
        // }
        .v-codemirror {
          display: block !important;
          overflow-y: auto;
          width: 100%;
          max-height: 600px;
        }
        .tips {
          position: absolute;
          right: 0;
          top: 0;
        }

        /* 滚动条整体 */
        ::-webkit-scrollbar {
          border-right: 1px solid #eeeeee;
          width: 8px;
          height: 8px;
          background-color: #ffffff;
        }

        /* 滚动条轨道 */
        ::-webkit-scrollbar-track {
          border-radius: 10px;
          background-color: #f6f6f6;
          cursor: pointer;
        }

        /* 滚动条滑块 */
        ::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background-color: #e4e4e4;
          cursor: pointer;
        }
      }
    }
  }
  .legend {
    position: absolute;
    left: 21%;
    top: 0;
    box-sizing: border-box;
    padding: 4px;
    border: 1px solid #eeeeee;
    width: 140px;
    height: 160px;
    background-color: #ffffff;
    color: #333333;
    &-title {
      margin: 12px 0;
      text-align: center;
    }
    &-item {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;
      &-notes {
        margin-left: 8px;
      }
      &-none {
        box-sizing: border-box;
        border: 1px solid #eead0e;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        background-color: #fffacd;
      }
      &-oprator {
        box-sizing: border-box;
        margin-right: 4px;
        // border: 1px solid #f38f8c;
        // background-color: #f7b7b5;
        border: 1px solid #eead0e;
        width: 16px;
        height: 16px;
        background-color: #fffacd;
        transform: translateX(2px) rotate(45deg);
      }
      &-variable {
        box-sizing: border-box;
        // border: 1px solid #2ab5c9;
        // background-color: #aee8f8;
        border: 1px solid #eead0e;
        width: 20px;
        height: 20px;
        background-color: #fffacd;
      }
      &-param {
        position: relative;
        box-sizing: border-box;
        // border: 20px solid #91d9ba;
        border: 20px solid #eead0e;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 0;
        width: 20px;
        height: 20px;
        &::before {
          position: absolute;
          left: 0;
          top: 0;
          box-sizing: border-box;
          // border: 18px solid #c3ffb8;
          border: 18px solid #fffacd;
          border-left: 9px solid transparent;
          border-right: 9px solid transparent;
          border-top: 0;
          width: 18px;
          height: 18px;
          content: "";
          transform: translateX(-9px) translateY(1px);
        }
      }
    }
  }
}
#container {
  position: relative;
  width: 100%;
}
.exportData {
  word-wrap: break-word;
}
.exportData + .btn-group {
  margin-top: 16px;
  text-align: center;
}
.el-textarea {
  width: 90%;

  /* 滚动条整体 */
  ::-webkit-scrollbar {
    border-right: 1px solid #eeeeee;
    width: 6px;
    background-color: #ffffff;
  }

  /* 滚动条轨道 */
  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #f6f6f6;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #e4e4e4;
    cursor: pointer;
  }
}
</style>
