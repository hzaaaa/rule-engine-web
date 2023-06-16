<template>
  <div class="detail">
    <!-- 按钮区 -->
    <div class="btns">
      <el-button @click="router.back()">返回</el-button>
      <span style="flex-grow: 1; margin: 0 12px; font-weight: 700">{{ modelName }}-{{ modelVersion }}</span>
      <el-button @click="importJson">导入</el-button>
      <el-button @click="exportJson">导出</el-button>
      <el-button type="primary" @click="submitModelInfo">1.提交</el-button>
      <el-button type="primary" @click="publishModelInfo">2.发布</el-button>
      <!-- <el-button @click="downloadImage">下载图片</el-button> -->
    </div>
    <div class="box" ref="boxPanel">
      <!-- 节点详情区 -->
      <div class="left" :style="'width: ' + leftPanelWidthPercent + '%'">
        <div class="info">
          <h4>节点信息</h4>
          <el-row v-if="currentNodeModel">
            <div class="label">节点ID：</div>
            <div>{{ currentNodeModel.id }}</div>
          </el-row>
          <el-row v-if="currentNodeModel">
            <div class="label">节点名称：</div>
            <div>{{ currentNodeModel.name }}</div>
          </el-row>
          <el-row v-if="currentNodeModel">
            <div class="label">节点类型：</div>
            <div>{{ nodeTypeEnum.getLabelByValue(currentNodeModel.nodeType) }}</div>
          </el-row>
          <el-row v-if="currentNodeModel?.className">
            <div class="label">算子类型：</div>
            <div>{{ getChineseName("classNameEnum", currentNodeModel.className) }}</div>
          </el-row>
        </div>
        <div class="operation">
          <el-scrollbar>
            <div v-if="isOperationButtonsVisible" class="operation-btns">
              <el-button @click="showAddNodeModel('add')" :disabled="!currentNodeModel" round>添加子节点</el-button>
              <el-button
                @click="showAddNodeModel('edit')"
                :disabled="!currentNodeModel || currentNodeModel.nodeType === nodeTypeEnum.NONE"
                round
              >
                编辑节点
              </el-button>
              <el-button @click="upNode" :disabled="!currentNodeModel" round>上移节点</el-button>
              <el-button @click="downNode" :disabled="!currentNodeModel" round>下移节点</el-button>
              <el-button @click="deleteNode" :disabled="!currentNodeModel" round plain type="danger">删除本节点</el-button>
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
                  <el-select v-model="addNodeModelForm.nodeType" @change="onNodeTypeChange" style="width: 100%">
                    <el-option
                      v-for="nodeType in nodeTypeEnum.options"
                      :key="nodeType.value"
                      :label="nodeType.label"
                      :value="nodeType.value"
                    ></el-option>
                  </el-select>
                </el-row>
                <!-- <el-row>
                  <div class="label">relationType：</div>
                  <el-select v-model="addNodeModelForm.relationType" style="width: 100%">
                    <el-option
                      v-for="relationType in relationTypeList"
                      :key="relationType.id"
                      :label="relationType.name"
                      :value="relationType.id"
                    ></el-option>
                  </el-select>
                </el-row> -->
                <el-row>
                  <div class="label">算子类型：</div>
                  <el-select v-model="addNodeModelForm.className" @change="onClassNameChange" style="width: 100%">
                    <el-option
                      v-for="className in classNameList"
                      :key="className.name"
                      :label="className.desc"
                      :value="className.clazz"
                    ></el-option>
                  </el-select>
                </el-row>
                <!-- <el-row v-if="addNodeModelForm.nodeType === 13">
                  <div class="label">节点ID(逗号分隔)：</div>
                  <el-input v-model="addNodeModelForm.multiplexIds"></el-input>
                </el-row> -->
                <el-row v-for="field in fieldsList" :key="field.field">
                  <div class="label">{{ `${field.desc}：` }}</div>
                  <el-radio-group v-model="dynamicForm[field.field]" v-if="field.type === 'boolean'">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                  <el-input v-model="dynamicForm[field.field]" v-else :placeholder="`请输入 ${field.type} 格式`"></el-input>
                </el-row>
                <el-button @click="cancleAddNodeModel" size="small" style="margin-bottom: 4px">取消</el-button>
                <el-button @click="submitAddNodeModel" type="primary" size="small" style="margin-bottom: 4px">确定</el-button>
              </el-scrollbar>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <!-- 左侧分隔栏，支持左右拖动 -->
      <div class="resizer" @mousedown="handleLeftMouseDown"></div>
      <div id="container"></div>
      <!-- 右侧分隔栏，支持左右拖动 -->
      <div class="resizer" @mousedown="handleMouseDown"></div>
      <!-- 叶子节点区 -->
      <div class="right" ref="rightPanel" :style="'width: ' + rigntPanelWidthPercent + '%'">
        <el-scrollbar v-if="currentNodeModel">
          <!-- 显示当前节点信息 -->
          <div v-for="child in [currentNodeModel]" :key="child?.id">
            <el-card class="card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>{{ child?.name }}</span>
                  <div>
                    <el-button type="primary" size="small" v-if="child?.classInfo" @click="submitSaveNodeJson(child)"
                      >保存</el-button
                    >
                  </div>
                </div>
              </template>
              <el-row>
                <div class="label">节点ID：</div>
                <div>{{ child?.id }}</div>
              </el-row>
              <el-row>
                <div class="label">节点类型：</div>
                <div>{{ nodeTypeEnum.getLabelByValue(child?.nodeType) }}</div>
              </el-row>
              <el-row v-if="child?.className">
                <div class="label">算子类型：</div>
                <div>{{ getChineseName("classNameEnum", child?.className) }}</div>
              </el-row>
              <el-row v-if="child?.classInfo || child?.classInfo === ''" class="jsonbox">
                <div class="label">配置JSON：</div>
                <!-- 第三版 vue-codemirror 编辑器插件，json可格式化，可修改json全文，可自由添加子属性 -->
                <codemirror v-model="child.classInfo" :extensions="extensions" @ready="beautifyCurField(child)" />
                <div class="tips">
                  <el-button type="primary" link size="small" @click="copyCurField(child.classInfo)">复制 JSON</el-button>
                  <el-button type="primary" link size="small" @click="beautifyCurField(child)">美化</el-button>
                </div>
              </el-row>
            </el-card>
          </div>
        </el-scrollbar>
      </div>
      <!-- 图例 -->
      <div class="legend" :style="'left: ' + (leftPanelWidthPercent + 1) + '%'">
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
    <el-dialog v-model="importVisible" title="导入" @closed="onImportClosed" top="10vh" width="800" class="importExportDialog">
      <el-form>
        <el-form-item label="配置：" label-width="60px">
          <div class="dialog-codemirror">
            <codemirror v-model="importData.classInfo" :extensions="extensions" @ready="beautifyCurField(importData)" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" link v-debounce="() => compressCurField(importData)">压缩</el-button>
        <el-button type="primary" link v-debounce="() => beautifyCurField(importData)">美化</el-button>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button @click="importConfirm" type="primary">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导出 弹窗 -->
    <el-dialog v-model="exportVisible" title="导出" @closed="onExportClosed" top="10vh" width="800" class="importExportDialog">
      <div v-if="exportData.classInfo" class="dialog-codemirror">
        <codemirror
          v-model="exportData.classInfo"
          :extensions="extensions"
          @ready="beautifyCurField(exportData)"
          :disabled="true"
        />
      </div>
      <div class="btn-group">
        <el-button type="primary" @click="onCopy(exportData.classInfo)">复制配置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { onBeforeRouteLeave, useRouter } from "vue-router";
// import { Graph } from "@antv/x6";
import G6 from "@antv/g6";
import { nanoid } from "nanoid";
import {
  getModelInfoInfoApi,
  getModelInfoPublishApi,
  getNodeClassInfoApi,
  postModelInfoExportApi,
  postModelInfoUpdateApi,
} from "@/api/engine/engine_v3";
import { copyTextToClipboard, getNodeByIdRecursive, swapIndex, addPidAndIndex, deletePidAndIndex } from "@/utils/util";
import { Codemirror } from "vue-codemirror";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { createEnum } from "@/utils/createEnum";
import { useModelStore } from "@/store/model";
import { ModelTreeItem } from "@/store/interface/model";
import { useRouteQueryStore } from "@/store/routeQuery";
import { useDebounceFn } from "@/hooks/useDebounceFn";
import { ElMessageBox } from "element-plus";

const router = useRouter();
const routeQueryStore = useRouteQueryStore();
const { modelId, modelName, modelInfoId, modelVersion } = routeQueryStore;

const modelStore = useModelStore();
const frontModelInfo = ref<ModelTreeItem[]>([]); // 前端保存的模型信息

/**
 * 操作区
 */
/**
 * 提交模型详情。调接口前去掉后端不需要的 pid 和 index 属性, 保存后删除本地模型缓存
 */
const submitModelInfo = async () => {
  // 前端模型信息转化为后端模型信息。id -> nodeId; children -> childrenList; 删掉 pid、index 属性
  let detailsData = JSON.parse(JSON.stringify(frontModelInfo.value[0]));
  deletePidAndIndex(detailsData);
  detailsData = JSON.parse(
    JSON.stringify(detailsData)
      .replace(/"id":/g, `"nodeId":`)
      .replace(/"children":/g, `"childrenList":`)
  );
  const params = {
    id: modelInfoId,
    modelInfo: detailsData,
  };
  await postModelInfoUpdateApi(params);
  ElMessage.success("提交成功");
  modelStore.deleteModel(`modelId_${modelId}`);
};
/**
 * 发布模型详情。如果本地有模型缓存，提示保存
 */
const publishModelInfo = async () => {
  if (modelStore.model[`modelId_${modelId}`]) {
    ElMessage.warning("请先提交后再发布");
    return;
  }
  let params = { modelInfoId, publish: true };
  await getModelInfoPublishApi(params);
  ElMessage.success("发布成功");
};
/**
 * 导入模型详情
 */
const importJson = () => {
  importVisible.value = true;
};
/**
 * 导出模型详情。如果本地有模型缓存，提示保存
 */
const exportJson = () => {
  if (modelStore.model[`modelId_${modelId}`]) {
    ElMessage.warning("请先提交后再导出");
    return;
  }
  // 调用接口获取模型信息并只读展示
  const formData = new FormData();
  formData.append("modelInfoId", String(modelInfoId));
  postModelInfoExportApi(formData).then((res: any) => {
    exportData.classInfo = res.data.modelInfo;
  });
  exportVisible.value = true;
};
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
const importData = reactive({ classInfo: "" });
const importConfirm = useDebounceFn(() => {
  const params: any = {
    id: modelInfoId,
    modelInfo: null,
  };
  // 如果 json 报错，提示并返回
  try {
    params.modelInfo = JSON.parse(importData.classInfo);
  } catch (error) {
    ElMessage.warning("导入模型 JSON 格式不正确，请修改后再提交");
    return;
  }

  // 提示导入的模型将覆盖原模型，继续覆盖的话调用后端接口直接写到数据库并更新页面、清空前端缓存，
  ElMessageBox.confirm(`导入模型将覆盖原模型，是否继续`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async () => {
      await postModelInfoUpdateApi(params);
      // 后端模型信息转化为前端模型信息。nodeId -> id; childrenList -> children; 计算添加 pid、index 属性
      const detailsData = JSON.parse(
        JSON.stringify(params.modelInfo)
          .replace(/"nodeId":\s*(\w+)/g, `"id":"$1"`)
          .replace(/"nodeId":/g, `"id":`)
          .replace(/"childrenList":/g, `"children":`)
      );
      addPidAndIndex(detailsData);
      frontModelInfo.value = [detailsData];
      initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
      modelStore.deleteModel(`modelId_${modelId}`);
      ElMessage.success("导入成功");
    })
    .catch((err) => {
      console.log(err);
    });

  // 关闭弹窗
  importVisible.value = false;
});
const onImportClosed = () => {
  importData.classInfo = "";
};

/**
 * 导出 弹窗
 */
const exportVisible = ref(false);
const exportData = reactive({ classInfo: "" });
const onCopy = (text: string) => {
  copyTextToClipboard(text);
  ElMessage.success("复制成功");
  exportVisible.value = false;
};
const onExportClosed = () => {
  exportData.classInfo = "";
};

/**
 * 画布区
 */
// const selectedNodeType = ref(14);

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
const initTree = (treeData: any) => {
  if (graph && graph.destroy) {
    graph.destroy();
    graph = null;
  }
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
      minZoom: 0.2,
      maxZoom: 2,
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
        active: {
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
      const { nodeType, name } = node;

      return {
        type: getStyle(nodeType).type,
        label: createRoot ? "ERROR" : `${name}`,
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
      chooseRoot();
    }
    graph.fitView(100);
    bindEvents();
  }
};
// 默认选中根节点
const chooseRoot = () => {
  const rootNode = graph.find("node", (node: any) => {
    return node.getModel().depth === 0;
  });
  const rootModel = rootNode.getModel();
  // 初始加载时，默认选中根节点
  graph.setItemState(rootNode, "active", true);
  currentNodeModel.value = rootModel;
};
// 选中指定 id 的节点
// const selectNodeModelById = (id: string) => {
//   currentNodeModel.value = graph.findDataById(id);
// };
// 页面变化后，将 canvas 画布与 container 大小保持一致
if (typeof window !== "undefined") {
  window.onresize = () => {
    if (!graph || graph.get("destroyed")) return;
    if (!container || !container.scrollWidth || !container.scrollHeight) return;
    graph.changeSize(container.scrollWidth, container.scrollHeight);
  };
}
const getStyle = (type: number) => {
  if (type === 1) {
    // 根节点
    return {
      type: "circle",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
    // } else if (type === 1) {
    //   // AND
    //   return {
    //     type: "diamond",
    //     // color: "#F7B7B5",
    //     // stroke: "#f38f8c",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [31, 31],
    //   };
    // } else if (type === 2) {
    //   // TRUE
    //   return {
    //     type: "diamond",
    //     // color: "#FFBC95",
    //     // stroke: "#f79d69",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [30, 20],
    //   };
    // } else if (type === 3) {
    //   // ALL
    //   return {
    //     type: "rect",
    //     // color: "#aee8f8",
    //     // stroke: "#2ab5c9",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [26, 26],
    //   };
    // } else if (type === 4) {
    //   // ANY
    //   return {
    //     type: "triangle",
    //     // color: "#c3ffb8",
    //     // stroke: "#91d9ba",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [16, 16],
    //   };
  } else if (type === 3) {
    // FLOW 节点，叶子节点，已不再显示
    return {
      type: "diamond",
      // color: "#C1FFC1",
      // stroke: "#00CD00",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [31, 31],
    };
  } else if (type === 4) {
    // Result 节点，叶子节点，已不再显示
    return {
      type: "rect",
      // color: "#C1FFC1",
      // stroke: "#00CD00",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [26, 26],
    };
    // } else if (type === 7) {
    //   // None 节点，叶子节点已不再显示
    //   return {
    //     type: "triangle",
    //     // color: "#C1FFC1",
    //     // stroke: "#00CD00",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [16, 16],
    //   };
    // } else if (type === 8) {
    //   // P_None 节点
    //   return {
    //     type: "circle",
    //     // color: "#C9D8DF",
    //     // stroke: "#98bccd",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [30, 30],
    //   };
    // } else if (type === 9) {
    //   // P_AND
    //   return {
    //     type: "circle",
    //     // color: "#B2DEE1",
    //     // stroke: "#6dacb0",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [30, 30],
    //   };
    // } else if (type === 10) {
    //   // P_TRUE
    //   return {
    //     type: "circle",
    //     // color: "#F7E6D6",
    //     // stroke: "#d7bea7",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [30, 30],
    //   };
    // } else if (type === 11) {
    //   // P_ALL
    //   return {
    //     type: "circle",
    //     // color: "#4CB19C",
    //     // stroke: "#13878b",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [30, 30],
    //   };
    // } else if (type === 12) {
    //   // P_ANY
    //   return {
    //     type: "circle",
    //     // color: "#D25B85",
    //     // stroke: "#d02561",
    //     color: "#FFFACD",
    //     stroke: "#EEAD0E",
    //     size: [30, 30],
    //   };
  } else if (type === 5) {
    // 操作算子
    return {
      type: "diamond",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [31, 31],
    };
  } else if (type === 6) {
    // 变量算子
    return {
      type: "rect",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [26, 26],
    };
  } else if (type === 7) {
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
  // 点击 canvas 空白处，不做任何操作
  // graph.on("click", (ev: any) => {
  //   if (!ev.item || ev.item._cfg.type !== "node") {
  //     setBlankAreaActive();
  //     isOperationButtonsVisible.value = true;
  //     // clearCurNodeState();
  //     // cancleAddNodeModel();
  //     // graph.getNodes().forEach((node: any) => {
  //     //   graph.clearItemStates(node);
  //     // });
  //   }
  // });
  // 左键单击节点时
  graph.on("node:click", (evt: any) => {
    const { item } = evt;
    const model = item.getModel(); // 元素实例的数据模型
    graph.getNodes().forEach((node: any) => {
      graph.clearItemStates(node);
    });
    item.setState("active", true);
    console.log("model", model, item.getStates());
    if (model?.id !== currentNodeModel.value.id) {
      // 如果点击节点不为当前缓存节点，清空左侧信息区并将当前缓存节点替换为点击节点
      cancleAddNodeModel();
      currentNodeModel.value = model;
    }
  });
};

/**
 * 节点操作区
 */
// 节点类型枚举
const nodeTypeEnum = createEnum([
  ["NONE", 1, "none"],
  ["RELATION", 2, "关系节点"],
  ["FLOW", 3, "flow"],
  ["RESULT", 4, "result"],
  ["OPERATOR", 5, "操作算子"],
  ["VARIABLE", 6, "变量算子"],
  ["PARAM", 7, "参数绑定算子"],
]);

// const nodeTypeEnum = {
//   "0": "根节点",
//   "1": "关系节点",
//   "6": "表达式计算算子",
//   "14": "操作算子",
//   "15": "变量算子",
//   "16": "参数绑定算子",
// };
// 算子类型枚举
const classNameEnum = {
  ContextUpdateNone: "修改处理上下文",
  AddOperator: "求和算子",
  BinaryLogicalChooseOperator: "二元逻辑选择符算子",
  BinaryLogicalOperator: "二元逻辑计算符算子",
  CalculateOperator: "计算表达式执行符算子",
  IntervalLORCCaseOperator: "左开右闭区间算子",
  MultiplicationOperator: "乘法算子",
  SubtractionOperator: "减法算子",
  SingleParam: "绑定单变量名",
  SingleContextVariable: "单变量",
};
// const nodeTypeList = [
//   { name: "操作算子", id: 14 },
//   { name: "变量算子", id: 15 },
//   { name: "参数绑定算子", id: 16 },
//   { name: "None", id: 7 },
//   { name: "节点ID", id: 13 },
//   { name: "关系节点", id: 1 },
//   // { name: "Flow", id: 5 },
//   { name: "表达式计算算子", id: 6 },
// ];
// 节点 ID 类型只在新增时出现，编辑时不出现
// const filterNodeTypeList = computed(() => {
//   return editNodeModelType.value === "edit" ? nodeTypeList.filter((t) => t.id !== 13) : nodeTypeList;
// });

// const relationTypeList = [
//   // { name: "AND", id: 1 },
//   // { name: "TRUE", id: 2 },
//   { name: "ALL", id: 3 },
//   { name: "ANY", id: 4 },
//   // { name: "NONE", id: 0 },
//   // { name: "P_AND", id: 9 },
//   // { name: "P_TRUE", id: 10 },
//   // { name: "P_ALL", id: 11 },
//   // { name: "P_ANY", id: 12 },
//   // { name: "P_NONE", id: 8 },
// ];
// 获取节点类型以及算子类型的中文名
const getChineseName = (target: "classNameEnum", key: string) => {
  let k = key.split(".").pop() as keyof typeof classNameEnum;
  return classNameEnum[k] ?? "";
};

const classNameList = ref<any[]>([]); // 算子类型列表，后端接口动态返回
const dynamicForm = ref<any>({}); // 添加节点时动态输入框绑定值
// 添加节点时的动态输入框列表
const fieldsList = computed(() => {
  return classNameList.value.find((className) => className.clazz === addNodeModelForm.className)?.fields ?? [];
});
const onClassNameChange = () => {
  dynamicForm.value = {};
  fieldsList.value.forEach((field: any) => (dynamicForm.value[field.field] = ""));
};

/**
 * 节点详情区
 */
const isOperationButtonsVisible = ref(true); // 是否显示左侧初始按钮界面
const operationTitle = ref("添加子节点"); // 操作界面标题
const editNodeModelType = ref("add"); // 操作类型，"add": 添加子节点; "edit": 编辑节点
const addNodeModelFormOrigin = {
  name: "",
  nodeType: nodeTypeEnum.OPERATOR,
  className: "",
  classInfo: "",
};
const addNodeModelForm = reactive({
  name: "",
  nodeType: nodeTypeEnum.OPERATOR,
  className: "",
  classInfo: "",
});

const showAddNodeModel = (type: "add" | "edit" = "add") => {
  editNodeModelType.value = type;
  operationTitle.value = type === "add" ? "添加子节点" : "编辑节点";
  isOperationButtonsVisible.value = false;
  if (type === "edit") {
    // 编辑节点
    Object.assign(addNodeModelForm, {
      name: currentNodeModel.value.name,
      nodeType: currentNodeModel.value.nodeType,
      className: currentNodeModel.value.className,
    });
    getNodeClassInfoApi({ type: addNodeModelForm.nodeType }).then((res) => {
      classNameList.value = res.data;
    });
    if (currentNodeModel.value.classInfo) {
      try {
        dynamicForm.value = JSON.parse(currentNodeModel.value.classInfo);
      } catch (error) {
        console.error(error);
      }
    }
    for (const [k, v] of Object.entries(dynamicForm.value)) {
      if (typeof v === "object") {
        try {
          dynamicForm.value[k] = JSON.stringify(v);
        } catch (error) {
          dynamicForm.value[k] = v;
        }
      }
    }
  } else {
    // 添加子节点
    getNodeClassInfoApi({ type: addNodeModelForm.nodeType }).then((res) => {
      classNameList.value = res.data;
    });
  }
};

// 清除左右两侧信息区信息
const cancleAddNodeModel = () => {
  editNodeModelType.value = "";
  isOperationButtonsVisible.value = true;
  clearEditModelForm();
};
// 清空左侧添加修改节点表单，清空算子类型列表，清空动态输入框绑定值
const clearEditModelForm = () => {
  Object.assign(addNodeModelForm, addNodeModelFormOrigin);
  classNameList.value.length = 0;
  dynamicForm.value = {};
};
// 添加子节点、编辑节点时点击确定
const submitAddNodeModel = () => {
  let params: any = {
    name: addNodeModelForm.name,
    nodeType: addNodeModelForm.nodeType,
  };
  if (addNodeModelForm.className) params.className = addNodeModelForm.className;
  if (Object.keys(dynamicForm.value).length) {
    let res: any = {};
    Object.keys(dynamicForm.value).forEach((key: any) => {
      if (dynamicForm.value[key] || typeof dynamicForm.value[key] === "boolean") {
        try {
          res[key] = JSON.parse(dynamicForm.value[key]);
        } catch (error) {
          res[key] = dynamicForm.value[key];
        }
      }
    });
    params.classInfo = JSON.stringify(res);
  }

  if (editNodeModelType.value === "add") {
    params.id = nanoid();
    const pid = currentNodeModel.value.id;
    const frontModelParentNode = getNodeByIdRecursive(frontModelInfo.value, pid);
    frontModelParentNode.children = frontModelParentNode.children ?? [];
    params.pid = pid;
    params.index = frontModelParentNode.children.length;
    frontModelParentNode.children.push({ ...params });
    initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
    // 有增删改操作后再存入 pinia
    modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
    cancleAddNodeModel();
  } else if (editNodeModelType.value === "edit") {
    const frontModelCurrentNode = getNodeByIdRecursive(frontModelInfo.value, currentNodeModel.value.id);
    Object.assign(frontModelCurrentNode, params);
    initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
    // 有增删改操作后再存入 pinia
    modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
    cancleAddNodeModel();
  }
};
const upNode = () => {
  const tree = frontModelInfo.value;
  // 获取当前节点，如果当前节点 index===0, 无法上移，直接返回
  const frontModelCurrentNode = getNodeByIdRecursive(frontModelInfo.value, currentNodeModel.value.id);
  const index = frontModelCurrentNode.index;
  if (index === undefined || index === 0) {
    ElMessage.error("无法上移节点");
    return;
  }
  // 获取当前节点父节点
  const frontModelParentNode = getNodeByIdRecursive(tree, frontModelCurrentNode.pid);
  if (!frontModelParentNode) {
    ElMessage.error("无法上移节点");
    return;
  }
  // 交换当前对象和前一对象位置
  swapIndex(frontModelParentNode.children, index - 1, index);
  // 将上一对象的index+1，当前对象index-1
  frontModelParentNode.children[index - 1].index = index - 1;
  frontModelParentNode.children[index].index = index;
  initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
  // 有增删改操作后再存入 pinia
  modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
  ElMessage.success("上移节点成功");
};
const downNode = () => {
  const tree = frontModelInfo.value;
  // 获取当前节点，如果当前节点 index===0, 无法上移，直接返回
  const frontModelCurrentNode = getNodeByIdRecursive(frontModelInfo.value, currentNodeModel.value.id);
  const index = frontModelCurrentNode.index;

  // 获取当前节点父节点, 如果当前节点 index===父节点children.length-1, 无法下移，直接返回
  const frontModelParentNode = getNodeByIdRecursive(tree, frontModelCurrentNode.pid);
  if (!frontModelParentNode || index === undefined || index === frontModelParentNode.children.length - 1) {
    ElMessage.error("无法下移节点");
    return;
  }
  // 交换当前对象和后一对象位置
  swapIndex(frontModelParentNode.children, index, index + 1);

  // 将后一对象的index-1，当前对象index+1
  frontModelParentNode.children[index].index = index;
  frontModelParentNode.children[index + 1].index = index + 1;
  initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
  // 有增删改操作后再存入 pinia
  modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
  ElMessage.success("下移节点成功");
};
const deleteNode = () => {
  ElMessageBox.confirm(`确认删除<${currentNodeModel.value.name}>节点吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      const tree = frontModelInfo.value;
      // 获取当前节点
      const frontModelCurrentNode = getNodeByIdRecursive(frontModelInfo.value, currentNodeModel.value.id);
      const index = frontModelCurrentNode.index;

      // 获取当前节点父节点
      const frontModelParentNode = getNodeByIdRecursive(tree, frontModelCurrentNode.pid);

      // 从当前节点父节点 children 数组里删除当前节点
      frontModelParentNode.children.splice(index, 1);

      // 遍历修改父节点 children 里所有对象的 index
      frontModelParentNode.children.forEach((node: any, index: number) => {
        node.index = index;
      });
      initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
      // 有增删改操作后再存入 pinia
      modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
      ElMessage.success("删除成功");
    })
    .catch(() => {});
};
const onNodeTypeChange = (type: number) => {
  addNodeModelForm.nodeType = type;
  addNodeModelForm.className = "";
  classNameList.value.length = 0;
  dynamicForm.value = {};
  getNodeClassInfoApi({ type: addNodeModelForm.nodeType }).then((res) => {
    classNameList.value = res.data;
  });
};

/**
 * 叶子节点区
 */
const currentNodeModel = ref<any>(); // 当前节点的 model 信息 (包含节点数据 和 G6 添加的部分属性)
// 保存当前节点的 json 数据
const submitSaveNodeJson = (item: any) => {
  let params: any = {
    classInfo: item.classInfo,
  };
  const frontModelCurrentNode = getNodeByIdRecursive(frontModelInfo.value, currentNodeModel.value.id);
  Object.assign(frontModelCurrentNode, params);
  initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
  // 有增删改操作后再存入 pinia
  modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
  cancleAddNodeModel();
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
const compressCurField = (nodeItem: any) => {
  if (nodeItem.classInfo === "") return; // 当 json 为空字符串时直接返回，避免 format 时 JSON.parse 报错
  try {
    nodeItem.classInfo = compressJsonstr(nodeItem.classInfo);
  } catch (error) {
    ElMessage.warning("导入模型 JSON 格式不正确");
  }
};
const compressJsonstr = (jsonstr: string) => {
  return JSON.stringify(JSON.parse(jsonstr));
};
const beautifyCurField = (nodeItem: any) => {
  if (nodeItem.classInfo === "") return; // 当 json 为空字符串时直接返回，避免 format 时 JSON.parse 报错
  try {
    nodeItem.classInfo = formatJsonstr(nodeItem.classInfo);
  } catch (error) {
    ElMessage.warning("导入模型 JSON 格式不正确");
  }
};
const formatJsonstr = (jsonstr: string) => {
  return JSON.stringify(JSON.parse(jsonstr), null, 2);
};

/**
 * 分隔栏，支持左右拖动
 */
const boxPanel = ref();
const rigntPanelWidthPercent = ref(29);
const leftPanelWidthPercent = ref(20);
const handleMouseDown = () => {
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
};
const handleMouseMove = (e: MouseEvent) => {
  const clientRect = boxPanel.value.getBoundingClientRect();
  const offset = e.pageX - clientRect.left + 18;
  rigntPanelWidthPercent.value = 100 - (offset / clientRect.width) * 100;
  if (rigntPanelWidthPercent.value < 20) rigntPanelWidthPercent.value = 20;
  if (rigntPanelWidthPercent.value > 50) rigntPanelWidthPercent.value = 50;
};
const handleMouseUp = () => {
  document.removeEventListener("mousemove", handleMouseMove);
  if (!graph || graph.get("destroyed")) return;
  if (!container || !container.scrollWidth || !container.scrollHeight) return;
  graph.changeSize(container.scrollWidth, container.scrollHeight);
};
const handleLeftMouseDown = () => {
  document.addEventListener("mousemove", handleLeftMouseMove);
  document.addEventListener("mouseup", handleLeftMouseUp);
};
const handleLeftMouseMove = (e: MouseEvent) => {
  const clientRect = boxPanel.value.getBoundingClientRect();
  const offset = e.pageX - clientRect.left - 8;
  leftPanelWidthPercent.value = (offset / clientRect.width) * 100;
  if (leftPanelWidthPercent.value < 16) leftPanelWidthPercent.value = 16;
  if (leftPanelWidthPercent.value > 30) leftPanelWidthPercent.value = 30;
};
const handleLeftMouseUp = () => {
  document.removeEventListener("mousemove", handleLeftMouseMove);
  if (!graph || graph.get("destroyed")) return;
  if (!container || !container.scrollWidth || !container.scrollHeight) return;
  graph.changeSize(container.scrollWidth, container.scrollHeight);
};

// 页面挂载后首先查前端缓存有无模型数据，有则取前端缓存，无则取后端，后端无则前端新建
const getModel = () => {
  if (modelStore.model[`modelId_${modelId}`]) {
    // 1.如果前端缓存有模型数据，取前端缓存(页面刷新等情况); 前端缓存在 页面卸载时 & 保存修改模型后 删掉
    frontModelInfo.value = modelStore.model[`modelId_${modelId}`];
    initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
  } else {
    // 2.前端无缓存，如果后端有模型数据，则取后端模型信息
    getModelInfoInfoApi({ modelInfoId }).then(async (res) => {
      if (res.code === 200) {
        const curModelInfo = res.data.modelInfo;
        if (curModelInfo) {
          // 后端模型信息转化为前端模型信息。nodeId -> id; childrenList -> children; 计算添加 pid、index 属性
          const detailsData = JSON.parse(
            curModelInfo
              .replace(/"nodeId":\s*(\w+)/g, `"id":"$1"`)
              .replace(/"nodeId":/g, `"id":`)
              .replace(/"childrenList":/g, `"children":`)
          );
          addPidAndIndex(detailsData);
          frontModelInfo.value = [detailsData];
          // 有增删改操作后再存入 pinia
          // modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
          initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
        } else {
          // 3.如果前端无缓存且后端无模型数据，则前端新建模型
          frontModelInfo.value = [
            {
              id: nanoid(),
              nodeType: 1,
              name: "根节点",
              className: "com.weiyankeji.rule.engine.core.node.none.ContextUpdateNone",
              pid: "0",
              index: 0,
            },
          ];
          modelStore.setModel(`modelId_${modelId}`, frontModelInfo.value);
          initTree(JSON.parse(JSON.stringify(frontModelInfo.value[0])));
        }
      }
    });
  }
};
onMounted(() => {
  getModel();
});

onUnmounted(() => {
  modelStore.deleteModel(`modelId_${modelId}`);
});

onBeforeRouteLeave((to, from, next) => {
  console.log("onBeforeRouteLeave");
  if (modelStore.model[`modelId_${modelId}`]) {
    ElMessageBox.confirm("编辑内容尚未提交，是否提交？", "提示", {
      confirmButtonText: "提交",
      cancelButtonText: "不提交",
      type: "warning",
      showClose: false,
      closeOnClickModal: false,
      beforeClose: async (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          await submitModelInfo();
          instance.confirmButtonLoading = false;
          done();
        } else {
          done();
        }
      },
    })
      .then(() => {
        next();
      })
      .catch(() => {
        next();
      });
  } else {
    next();
  }
});
</script>

<style scoped lang="scss">
.detail {
  position: relative;
  height: 100%;
  .btns {
    display: flex;
    align-items: center;
  }
}
.box {
  display: flex;
  overflow: hidden;
  position: relative;
  margin-top: 8px;
  width: 100%;
  height: calc(100% - 40px);
  background-color: #ffffff;
  .left {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 4px;
    // border-right: 1px solid #eeeeee;
    width: 20%;
    height: 100%;
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
      min-height: 160px;
    }
    .operation {
      overflow: auto;
      flex: 1;
      box-sizing: border-box;
      padding: 8px 0;
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
  .resizer {
    z-index: 2;
    flex-shrink: 0;
    width: 2px;
    background-color: #dddddd;
    cursor: ew-resize;
    user-select: none;
  }
  .right {
    overflow: hidden;
    z-index: 1;
    flex-shrink: 0;
    padding: 8px;
    background-color: #ffffff;
    // border-left: 1px solid #dddddd;
    // width: 30%;
    .card {
      margin-bottom: 12px;
      background-color: #ffffff;
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
    // left: 21%;
    top: 8px;
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
  // width: 100%;
  flex-grow: 1;
  flex-shrink: 1;
  :deep(canvas) {
    position: absolute;
    z-index: 0;
  }
}
:deep(.importExportDialog) {
  .el-dialog__body {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    max-height: 70vh;
    .dialog-codemirror {
      border: 1px solid #cccccc;
      width: 100%;
      height: 60vh;
      .cm-editor {
        height: 60vh;
      }
    }
    .btn-group {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  }
}
</style>
