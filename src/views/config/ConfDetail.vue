<template>
  <div class="detail">
    <!-- 按钮区 -->
    <div class="btn">
      <el-button @click="router.back()">返回</el-button>
      <el-button type="primary" @click="release">发布</el-button>
      <el-button type="danger" @click="confUpdateClean">清除</el-button>
      <el-button @click="importJson">导入</el-button>
      <el-button @click="exportJson">导出</el-button>
      <el-button @click="downloadImage">下载图片</el-button>
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
          <el-row v-if="currentNodeConf?.confField">
            <div class="label">配置JSON：</div>
            <el-input v-model="currentNodeConf.confField" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }"></el-input>
          </el-row>
        </div>
        <div class="operation">
          <div v-if="isOperationButtonsVisible" class="operation-btns">
            <el-button @click="showAddNodeModel('child')" v-if="!isCurrentLeafNode" :disabled="!currentNodeModel" round
              >添加子节点</el-button
            >
            <el-button @click="showAddNodeModel('front')" v-if="!currentNodeModel?.forward" :disabled="!currentNodeModel" round
              >添加前置节点</el-button
            >
            <el-button @click="showAddNodeModel('exchange')" :disabled="!currentNodeModel" round>节点转换</el-button>
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
                <div class="label">nodeType：</div>
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
                <div class="label">confName：</div>
                <el-select v-model="addNodeModelForm.confName" @change="onConfNameChange" style="width: 100%">
                  <el-option
                    v-for="confClass in confClassList"
                    :key="confClass.name"
                    :label="confClass.name"
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
                <el-input v-model="dynamicForm[field.field]" :placeholder="`请输入 ${field.type} 格式`"></el-input>
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
            <el-card class="card" shadow="hover" @click="consoleChild(child)">
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
              <el-row v-if="child?.showConf?.confField">
                <div class="label">配置JSON：</div>
                <el-input v-model="child.showConf.confField" type="textarea" :autosize="{ minRows: 5, maxRows: 20 }"></el-input>
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
          <div class="legend-item-and"></div>
          <div class="legend-item-notes">AND节点</div>
        </div>
        <div class="legend-item">
          <div class="legend-item-true"></div>
          <div class="legend-item-notes">TRUE节点</div>
        </div>
        <div class="legend-item">
          <div class="legend-item-all"></div>
          <div class="legend-item-notes">ALL节点</div>
        </div>
        <div class="legend-item">
          <div class="legend-item-any"></div>
          <div class="legend-item-notes">ANY节点</div>
        </div>
      </div>
    </div>

    <div class="operation-container" v-if="showOperation" :style="`top: ${selectedNode.y}px; left: ${selectedNode.x}px`">
      <div class="operation-item" @click="openEditModal(selectedNode.timeType || 1)">
        {{ addr && addr !== "server" ? "查看节点" : "查看/编辑节点" }}
      </div>
      <div class="operation-item" v-if="!isLeafNode && (!addr || addr === 'server')" @click="openAddNodeModal('child')">
        添加子节点
      </div>
      <div class="operation-item" v-if="!selectedNode.forward && (!addr || addr === 'server')" @click="openAddNodeModal('front')">
        添加前置节点
      </div>
      <div class="operation-item" v-if="!addr || addr === 'server'" @click="openExchangeModal">转换节点</div>
      <div class="operation-item" v-if="!addr || addr === 'server'" @click="upNode">上移节点</div>
      <div class="operation-item" v-if="!addr || addr === 'server'" @click="downNode">下移节点</div>
      <div class="operation-item" v-if="!addr || addr === 'server'" @click="deleteNode">删除本节点</div>
    </div>

    <!-- 查看/编辑节点弹窗 -->
    <el-dialog
      v-model="editNodeModalVisible"
      :title="addr && addr !== `server` ? `查看节点` : `查看/编辑节点`"
      width="600"
      @closed="onEditNodeModalClosed"
    >
      <el-form :model="editNodeModalForm" ref="editNodeModalFormRef">
        <el-form-item label="名称：" prop="name" :label-width="formLabelWidth" style="width: 90%">
          <el-input v-model="editNodeModalForm.name"></el-input>
        </el-form-item>
        <el-form-item label="时间类型：" prop="timeType" :label-width="formLabelWidth" style="width: 90%">
          <el-select v-model="editNodeModalForm.timeType" @change="onNodeTypeChange" style="width: 100%">
            <el-option
              v-for="timeType in timeTypeList"
              :key="timeType.id"
              :label="timeType.name"
              :value="timeType.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="editNodeModalForm.timeType === 5 || editNodeModalForm.timeType === 7"
          label="开始时间："
          prop="start"
          :label-width="formLabelWidth"
          style="width: 90%"
        >
          <el-date-picker v-model="editNodeModalForm.start" type="datetime" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item
          v-if="editNodeModalForm.timeType === 6 || editNodeModalForm.timeType === 7"
          label="结束时间："
          prop="end"
          :label-width="formLabelWidth"
          style="width: 90%"
        >
          <el-date-picker v-model="editNodeModalForm.end" type="datetime" placeholder="请选择日期" />
        </el-form-item>
        <el-form-item label="debug：" prop="debug" :label-width="formLabelWidth">
          <el-radio-group v-model="editNodeModalForm.debug">
            <el-radio :label="1">true</el-radio>
            <el-radio :label="0">false</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="inverse：" prop="inverse" :label-width="formLabelWidth">
          <el-radio-group v-model="editNodeModalForm.inverse">
            <el-radio :label="1">true</el-radio>
            <el-radio :label="0">false</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="showConf.nodeType === 5 || showConf.nodeType === 6 || showConf.nodeType === 7"
          label="配置Json："
          prop="confField"
          :label-width="formLabelWidth"
          style="width: 90%"
        >
          <el-input
            v-model="editNodeModalForm.confField"
            clearable
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 20 }"
            style="width: 100%"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="cancleEditNodeModal">取消</el-button>
        <el-button @click="submitEditNodeModal" type="primary">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加/转换节点弹窗 -->
    <el-dialog
      v-model="addNodeModalVisible"
      :title="addNodeModalType === 'exchange' ? '转换节点' : '添加节点'"
      width="600"
      @closed="onAddNodeModalClosed"
    >
      <el-form :model="addNodeModalForm" ref="addNodeModalFormRef">
        <el-form-item label="名称：" prop="name" :label-width="formLabelWidth" style="width: 90%">
          <el-input v-model="addNodeModalForm.name"></el-input>
        </el-form-item>
        <el-form-item label="nodeType：" prop="nodeType" :label-width="formLabelWidth" style="width: 90%">
          <el-select v-model="addNodeModalForm.nodeType" @change="onNodeTypeChange" style="width: 100%">
            <el-option
              v-for="nodeType in nodeTypeList"
              :key="nodeType.id"
              :label="nodeType.name"
              :value="nodeType.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="relationType："
          prop="relationType"
          v-if="selectedNodeType === 1"
          :label-width="formLabelWidth"
          style="width: 90%"
        >
          <el-select v-model="addNodeModalForm.relationType" style="width: 100%">
            <el-option
              v-for="relationType in relationTypeList"
              :key="relationType.id"
              :label="relationType.name"
              :value="relationType.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="confName："
          prop="confName"
          :label-width="formLabelWidth"
          v-if="selectedNodeType !== 1 && selectedNodeType !== 13"
          style="width: 90%"
        >
          <el-select v-model="addNodeModalForm.confName" @change="onConfNameChange" style="width: 100%">
            <el-option
              v-for="confClass in confClassList"
              :key="confClass.name"
              :label="confClass.name"
              :value="confClass.clazz"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="节点ID(逗号分隔)："
          prop="multiplexIds"
          :label-width="formLabelWidth"
          v-if="selectedNodeType === 13"
          style="width: 90%"
        >
          <el-input v-model="addNodeModalForm.multiplexIds"></el-input>
        </el-form-item>
        <el-form-item
          :label="`${field.desc}：`"
          :prop="field.field"
          v-for="field in confFieldsList"
          :key="field.field"
          :label-width="formLabelWidth"
          style="width: 90%"
        >
          <el-input v-model="dynamicForm[field.field]" :placeholder="`请输入 ${field.type} 格式`"></el-input>
        </el-form-item>
        <!-- <el-form-item
          label="配置Json："
          prop="confField"
          :label-width="formLabelWidth"
          v-if="selectedNodeType === 5 || selectedNodeType === 6 || selectedNodeType === 7"
          style="width: 90%"
        >
          <el-input
            v-model="addNodeModalForm.confField"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 20 }"
            style="width: 100%"
          ></el-input>
        </el-form-item> -->
      </el-form>
      <template #footer>
        <el-button @click="cancleAddNodeModal">取消</el-button>
        <el-button @click="submitAddNodeModal" type="primary">确定</el-button>
      </template>
    </el-dialog>

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
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
// import { Graph } from "@antv/x6";
import G6 from "@antv/g6";
import {
  getConfDetailApi,
  getConfLeafInfoApi,
  postConfEditApi,
  getConfReleaseApi,
  getConfUpdateCleanApi,
  getBaseExportApi,
  postBaseImportApi,
} from "@/api/engine/engine";
import { FormInstance } from "element-plus";
import { copyTextToClipboard, dateToStr } from "@/utils/util";

const route = useRoute();
const router = useRouter();
const { appId, baseId, confId } = route.query;

console.log("route", route.params, appId, baseId, confId);

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
const importJson = () => {
  importVisible.value = true;
};
const exportJson = () => {
  getBaseExportApi({ appId, baseId }).then((res) => {
    exportData.value = res.data.data;
  });
  exportVisible.value = true;
};
const downloadImage = () => {
  graph.downloadFullImage(undefined, undefined, {
    backgroundColor: "#eeeeee",
    padding: 20,
  });
  // graph.toFullDataURL((res) => console.log(res), undefined, {
  //   backgroundColor: "#eeeeee",
  //   padding: 20,
  // });
};

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
const addr = ref("server");
const selectedNode = ref<any>({});
const showOperation = ref(false);
const selectedNodeType = ref(1);
const timeType = ref(1);
const showConf = computed(() => {
  return selectedNode.value.showConf || {};
});
const isLeafNode = computed(() => {
  return showConf.value.nodeType === 5 || showConf.value.nodeType === 6 || showConf.value.nodeType === 7;
});
const isCurrentLeafNode = computed(() => {
  if (!currentNodeConf.value) return false;
  return currentNodeConf.value.nodeType === 5 || currentNodeConf.value.nodeType === 6 || currentNodeConf.value.nodeType === 7;
});

/**
 * 自定义节点
 */
const registerFn = () => {
  G6.registerNode(
    "circle-plus",
    {
      draw(cfg: any, group: any) {
        console.log("node.cgf", cfg);
        const circle = group.addShape("circle", {
          attrs: {
            fill: "pink",
            stroke: "#999",
            x: 0,
            y: 0,
            r: 16,
            cursor: "pointer",
          },
          name: "circle-shape",
        });
        group.addShape("text", {
          attrs: {
            text: cfg.label,
            x: 20,
            y: 0,
            textBaseline: "middle",
            fill: "#111",
          },
          name: "text-shape",
        });

        if (cfg.children && cfg.children.length) {
          group.addShape("marker", {
            attrs: {
              x: 0,
              y: 0,
              r: 8,
              symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
              stroke: "#666",
              lineWidth: 1,
              cursor: "pointer",
            },
            name: "collapse-icon",
          });
        }
        return circle;
      },
    },
    "circle"
  );
  G6.registerNode(
    "rect-plus",
    {
      draw(cfg: any, group: any) {
        console.log("node.cgf", cfg);
        const rect = group.addShape("rect", {
          attrs: {
            fill: "skyblue",
            stroke: "#999",
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            cursor: "pointer",
          },
          name: "rect-shape",
        });
        group.addShape("text", {
          attrs: {
            text: cfg.label,
            x: 40,
            y: 8,
            textBaseline: "middle",
            fill: "#111",
          },
          name: "text-shape",
        });

        if (cfg.children && cfg.children.length) {
          group.addShape("marker", {
            attrs: {
              x: 48,
              y: 24,
              r: 8,
              symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
              stroke: "#666",
              lineWidth: 1,
              cursor: "pointer",
            },
            name: "collapse-icon",
          });
        }
        return rect;
      },
    },
    "rect"
  );
  G6.registerNode(
    "diamond-plus",
    {
      draw(cfg: any, group: any) {
        console.log("node.cfg", cfg);
        const diamond = group.addShape("polygon", {
          attrs: {
            points: [
              [0, 20],
              [20, 0],
              [40, 20],
              [20, 40],
            ],
            fill: "gold",
            stroke: "#999",
            cursor: "pointer",
          },
          name: "polygon-shape",
        });

        // /*
        group.addShape("text", {
          attrs: {
            text: cfg.label,
            x: 36,
            y: 16,
            textBaseline: "middle",
            fill: "#111",
          },
          name: "text-shape",
        });

        if (cfg.children && cfg.children.length) {
          group.addShape("marker", {
            attrs: {
              x: 16,
              y: 16,
              r: 8,
              symbol: cfg.collapsed ? G6.Marker.expand : G6.Marker.collapse,
              stroke: "#666",
              lineWidth: 1,
              cursor: "pointer",
            },
            name: "collapse-icon",
          });
        }
        // */
        return diamond;
      },
    },
    "diamond"
  );
};
registerFn();

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
    graph = new G6.TreeGraph({
      container: "container",
      width,
      height,
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
          endArrow: {
            path: "M 0,0 L 10,3 L 10,-3 Z",
            fill: "#cfcfcf",
          },
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
      // layout: {
      //   type: "compactBox",
      //   direction: "LR",
      //   getId: function getId(d: any) {
      //     return d.id;
      //   },
      //   getVGap: function getVGap() {
      //     return 10;
      //   },
      //   getHGap: function getHGap() {
      //     return 120;
      //   },
      // },
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

    // console.log("getMinZoom", graph.getMinZoom());
    // console.log("getMaxZoom", graph.getMaxZoom());

    graph.data(treeData);
    graph.render();
    graph.fitView(100);
    bindEvents();
  }
};
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
      color: "#F7B7B5",
      stroke: "#f38f8c",
      size: [31, 31],
    };
  } else if (type === 2) {
    // TRUE
    return {
      type: "diamond",
      color: "#FFBC95",
      stroke: "#f79d69",
      size: [31, 31],
    };
  } else if (type === 3) {
    // ALL
    return {
      type: "rect",
      color: "#aee8f8",
      stroke: "#2ab5c9",
      size: [26, 26],
    };
  } else if (type === 4) {
    // ANY
    return {
      type: "triangle",
      color: "#c3ffb8",
      stroke: "#91d9ba",
      size: [16, 16],
    };
  } else if (type === 5) {
    // FLOW 节点，叶子节点，已不再显示
    return {
      type: "diamond",
      color: "#C1FFC1",
      stroke: "#00CD00",
      size: [31, 31],
    };
  } else if (type === 6) {
    // Result 节点，叶子节点，已不再显示
    return {
      type: "rect",
      color: "#C1FFC1",
      stroke: "#00CD00",
      size: [26, 26],
    };
  } else if (type === 7) {
    // None 节点，叶子节点已不再显示
    return {
      type: "triangle",
      color: "#C1FFC1",
      stroke: "#00CD00",
      size: [16, 16],
    };
  } else if (type === 8) {
    // P_None 节点
    return {
      type: "circle",
      color: "#C9D8DF",
      stroke: "#98bccd",
      size: [30, 30],
    };
  } else if (type === 9) {
    // P_AND
    return {
      type: "circle",
      color: "#B2DEE1",
      stroke: "#6dacb0",
      size: [30, 30],
    };
  } else if (type === 10) {
    // P_TRUE
    return {
      type: "circle",
      color: "#F7E6D6",
      stroke: "#d7bea7",
      size: [30, 30],
    };
  } else if (type === 11) {
    // P_ALL
    return {
      type: "circle",
      color: "#4CB19C",
      stroke: "#13878b",
      size: [30, 30],
    };
  } else if (type === 12) {
    // P_ANY
    return {
      type: "circle",
      color: "#D25B85",
      stroke: "#d02561",
      size: [30, 30],
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
    }
  });
  // 监听 node 上面 mouse 事件
  graph.on("node:contextmenu", (evt: any) => {
    const { item, originalEvent } = evt;
    originalEvent.preventDefault();
    const model = item.getModel();
    // console.log("model", model);
    const { x, y } = model;
    // console.log("x,y", x, y);
    const point = graph.getCanvasByPoint(x, y);
    // console.log("point", point);
    selectedNode.value = {
      ...model,
      id: model.id,
      x: point.x + 30,
      y: point.y + 60,
    };
    showOperation.value = true;
    // console.log("modal", selectedNode.value);
  });
  // 左键单击节点时
  graph.on("node:click", (evt: any) => {
    const { item } = evt;
    const model = item.getModel();
    // console.log("evt", evt);
    // console.log("model", model);
    // 切换节点时，需要先清空当前节点信息
    if (model?.showConf?.nodeId !== currentNodeConf?.value?.nodeId) {
      cancleAddNodeModel();
    }
    currentNodeModel.value = model;
    currentNodeConf.value = model.showConf;
    childNodes.value = [...model.leafNodes, ...model.children];
  });
};
const refreshGraph = () => {
  // 每次刷新图后，清空当前节点的信息
  currentNodeConf.value = null;
  currentNodeModel.value = null;
  childNodes.value = [];
  getConfDetailApi({ appId: Number(appId), baseId: Number(baseId), address: "server" }).then((res) => {
    console.log("getConfDetailApi", res.data);
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
    console.log("1-root", root);
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
      if (!children.length) return {};
      const _leave = <any>[];
      const _children = <any>[];
      children.forEach((child: any) => {
        if ([5, 6, 7].includes(child.showConf.nodeType)) {
          _leave.push({ ...child });
        } else {
          const childCopy = { ...child };
          const subChildren = childCopy.children ? [...childCopy.children] : [];
          if (childCopy.forward) {
            subChildren.unshift({ ...childCopy.forward, isNotChildren: true });
          }
          const res = filterLeaveAndChildren(subChildren);
          childCopy.leafNodes = res.leafNodes ?? [];
          childCopy.children = res.children ?? [];
          _children.push(childCopy);
        }
      });
      return { leafNodes: _leave, children: _children };
    };

    if (!root.children) root.children = [];
    const rootChildren = root.forward ? [{ ...root.forward, isNotChildren: true }, ...root.children] : [...root.children];

    const res = filterLeaveAndChildren(rootChildren);
    const treeData = {
      ...root,
      leafNodes: res.leafNodes,
      children: res.children,
    };
    console.log("2-treeData", treeData);

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
  { name: "Relation", id: 1 },
  { name: "Flow", id: 5 },
  { name: "Result", id: 6 },
  { name: "None", id: 7 },
  { name: "节点ID", id: 13 },
];

const relationTypeList = [
  { name: "AND", id: 1 },
  { name: "TRUE", id: 2 },
  { name: "ALL", id: 3 },
  { name: "ANY", id: 4 },
  { name: "NONE", id: 0 },
  { name: "P_AND", id: 9 },
  { name: "P_TRUE", id: 10 },
  { name: "P_ALL", id: 11 },
  { name: "P_ANY", id: 12 },
  { name: "P_NONE", id: 8 },
];

const confClassList = ref<any[]>([]);

const timeTypeList = [
  { name: "无时间限制", id: 1 },
  //   { name: "大于开始时间", id: 2 },
  //   { name: "小于结束时间", id: 3 },
  //   { name: "在开始时间与结束时间之内", id: 4 },
  { name: "大于开始时间", id: 5 },
  { name: "小于结束时间", id: 6 },
  { name: "在开始时间与结束时间之内", id: 7 },
];

const confFieldsList = ref<any[]>([]); // 添加节点时的动态输入框列表
const dynamicForm = ref<any>({}); // 添加节点时动态输入框绑定值

const openEditModal = (timetype: number) => {
  console.log("showConf", showConf.value);
  console.log("showConf", selectedNode.value);

  showOperation.value = false;
  timeType.value = timetype;
  editNodeModalVisible.value = true;
  editNodeModalForm.name = showConf.value.nodeName;
  editNodeModalForm.timeType = selectedNode.value.timeType || 1;
  editNodeModalForm.start = selectedNode.value.start;
  editNodeModalForm.end = selectedNode.value.end;
  editNodeModalForm.debug = showConf.value.debug || 1;
  editNodeModalForm.inverse = showConf.value.inverse || 0;
  editNodeModalForm.confField = showConf.value.confField;
};
const openAddNodeModal = (type: "child" | "front" = "child") => {
  showOperation.value = false;
  selectedNodeType.value = 1;
  addNodeModalVisible.value = true;
  addNodeModalType.value = type;
};
const openExchangeModal = () => {
  showOperation.value = false;
  selectedNodeType.value = 1;
  addNodeModalVisible.value = true;
  addNodeModalType.value = "exchange";
};
const upNode = async () => {
  showOperation.value = false;
  await postConfEditApi({
    appId,
    baseId,
    editType: 6,
    selectId: showConf.value.nodeId,
    parentId: selectedNode.value.parentId,
    nextId: selectedNode.value.nextId,
    index: selectedNode.value.index,
    moveTo: selectedNode.value.index - 1,
  });
  ElMessage.success("success");
  refreshGraph();
};
const downNode = async () => {
  showOperation.value = false;
  await postConfEditApi({
    appId,
    baseId,
    editType: 6,
    selectId: showConf.value.nodeId,
    parentId: selectedNode.value.parentId,
    nextId: selectedNode.value.nextId,
    index: selectedNode.value.index,
    moveTo: selectedNode.value.index + 1,
  });
  ElMessage.success("success");
  refreshGraph();
};
const deleteNode = () => {
  console.log("deleteNode");
  showOperation.value = false;
  ElMessageBox.confirm(`确认删除<${showConf.value.labelName}>节点吗？`, "", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      await postConfEditApi({
        appId,
        baseId,
        editType: 3,
        selectId: showConf.value.nodeId,
        parentId: selectedNode.value.parentId,
        nextId: selectedNode.value.nextId,
        index: selectedNode.value.index,
      });
      ElMessage.success("删除成功");
      refreshGraph();
    })
    .catch((err) => {
      console.error("postConfEditApi 错误", err);
    });
};

/**
 * 查看/编辑节点弹窗
 */
const editNodeModalVisible = ref(false);
const editNodeModalForm = reactive({
  name: "",
  timeType: selectedNode.value.timeType || 1,
  start: <Date | null>null,
  end: <Date | null>null,
  debug: 1,
  inverse: 0,
  confField: "",
});
const editNodeModalFormRef = ref<FormInstance>();
const submitEditNodeModal = () => {
  if ((editNodeModalForm.timeType === 5 || editNodeModalForm.timeType === 7) && !editNodeModalForm.start) {
    ElMessage.warning("请选择开始时间");
    return;
  }
  if ((editNodeModalForm.timeType === 6 || editNodeModalForm.timeType === 7) && !editNodeModalForm.end) {
    ElMessage.warning("请选择结束时间");
    return;
  }
  let params = <any>{
    appId,
    baseId,
    editType: 2,
    selectId: showConf.value.nodeId,
    debug: editNodeModalForm.debug,
    inverse: editNodeModalForm.inverse,
  };
  if (showConf.value.confName) params.confName = showConf.value.confName;
  if (showConf.value.nodeType) params.nodeType = showConf.value.nodeType;
  if (selectedNode.value.parentId) params.parentId = selectedNode.value.parentId;
  if (selectedNode.value.nextId) params.nextId = selectedNode.value.nextId;
  if (editNodeModalForm.name) params.name = editNodeModalForm.name;
  if (editNodeModalForm.timeType) params.timeType = editNodeModalForm.timeType;
  if (editNodeModalForm.start) params.start = dateToStr(editNodeModalForm.start);
  if (editNodeModalForm.end) params.end = dateToStr(editNodeModalForm.end);
  if (editNodeModalForm.confField) params.confField = editNodeModalForm.confField;

  editNodeModalVisible.value = false;
  postConfEditApi(params).then((res) => {
    if (res.code === 200) {
      ElMessage.success("success");
      refreshGraph();
    }
  });
};
const cancleEditNodeModal = () => {
  editNodeModalVisible.value = false;
  console.log("showConf", showConf.value);
  console.log("selectedNode.value", selectedNode.value);
};
const onEditNodeModalClosed = () => {
  editNodeModalFormRef.value?.resetFields();
};

/**
 * 添加/转换节点弹窗
 */
const addNodeModalVisible = ref(false);
const addNodeModalType = ref("child");
const addNodeModalForm = reactive({ name: "", nodeType: 1, relationType: 1, confName: "", multiplexIds: "", confField: "" });
const addNodeModalFormRef = ref<FormInstance>();
const formLabelWidth = "160px";
const submitAddNodeModal = () => {
  let params = <any>{
    appId,
    baseId,
    editType: addNodeModalType.value === "child" ? 1 : addNodeModalType.value === "exchange" ? 5 : 4,
    selectId: showConf.value.nodeId,
  };
  if (selectedNode.value.parentId) params.parentId = selectedNode.value.parentId;
  if (selectedNode.value.nextId) params.nextId = selectedNode.value.nextId;
  if (selectedNode.value.index) params.index = selectedNode.value.index;
  if (addNodeModalForm.name) params.name = addNodeModalForm.name;
  if (addNodeModalForm.nodeType) params.nodeType = addNodeModalForm.nodeType;
  // if (addNodeModalForm.nodeType === 1) {
  //   if (addNodeModalForm.relationType) params.relationType = addNodeModalForm.relationType;
  // }
  if (addNodeModalForm.nodeType === 5 || addNodeModalForm.nodeType === 6 || addNodeModalForm.nodeType === 7) {
    if (addNodeModalForm.confName) params.confName = addNodeModalForm.confName;
    // if (addNodeModalForm.confField) params.confField = addNodeModalForm.confField;
    if (Object.keys(dynamicForm.value).length) {
      let res = <any>{};
      Object.keys(dynamicForm.value).forEach((key: any) => {
        if (dynamicForm.value[key]) {
          try {
            res[key] = JSON.parse(dynamicForm.value[key]);
          } catch (error) {
            res[key] = dynamicForm.value[key];
          }
        }
      });
      params.confField = JSON.stringify(res);
    }
  }
  if (addNodeModalForm.nodeType === 13) {
    if (addNodeModalForm.multiplexIds) params.multiplexIds = addNodeModalForm.multiplexIds;
  }
  if (params.nodeType === 1) params.nodeType = addNodeModalForm.relationType;
  // if (params.nodeType === 8) delete params.nodeType;

  addNodeModalVisible.value = false;
  postConfEditApi(params).then((res) => {
    if (res.code === 200) {
      ElMessage.success("success");
      refreshGraph();
    }
  });
};
const cancleAddNodeModal = () => {
  addNodeModalVisible.value = false;
};
const onAddNodeModalClosed = () => {
  addNodeModalFormRef.value?.resetFields();
  confFieldsList.value.length = 0;
  dynamicForm.value = {};
};
const onNodeTypeChange = (type: number) => {
  console.log("onNodeTypeChange");
  if (type !== selectedNodeType.value) {
    addNodeModalForm.confName = "";
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
const onConfNameChange = (val: any) => {
  confFieldsList.value = confClassList.value.find((conf) => conf.clazz === val)?.fields;
  dynamicForm.value = {};
  confFieldsList.value.forEach((conf) => (dynamicForm.value[conf.field] = ""));
};

/**
 * 节点详情区
 */
const childNodes = ref<any[]>([]);
const isOperationButtonsVisible = ref(true);
const addNodeModelType = ref("child");
const operationTitle = ref("添加子节点");
const addNodeModelFormOrigin = { name: "", nodeType: 1, relationType: 1, confName: "", multiplexIds: "", confField: "" };
const addNodeModelForm = reactive({ name: "", nodeType: 1, relationType: 1, confName: "", multiplexIds: "", confField: "" });

const showAddNodeModel = (type: "child" | "front" | "exchange" = "child") => {
  addNodeModelType.value = type;
  operationTitle.value = type === "child" ? "添加子节点" : type === "front" ? "添加前置节点" : "节点转换";
  isOperationButtonsVisible.value = false;
  selectedNodeType.value = 1;
  if (type === "exchange") {
    console.log("节点转换\n", currentNodeConf.value);
    addNodeModelForm.name = currentNodeConf.value.nodeName;
    if (currentNodeConf.value.nodeType === 0) {
      addNodeModalForm.nodeType = 1;
      addNodeModalForm.relationType = 7;
    } else {
      addNodeModelForm.nodeType = 1;
      addNodeModelForm.relationType = currentNodeConf.value.nodeType;
    }
  }
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
  if (addNodeModelForm.nodeType === 5 || addNodeModelForm.nodeType === 6 || addNodeModelForm.nodeType === 7) {
    if (addNodeModelForm.confName) params.confName = addNodeModelForm.confName;
    if (Object.keys(dynamicForm.value).length) {
      let res = <any>{};
      Object.keys(dynamicForm.value).forEach((key: any) => {
        if (dynamicForm.value[key]) {
          try {
            res[key] = JSON.parse(dynamicForm.value[key]);
          } catch (error) {
            res[key] = dynamicForm.value[key];
          }
        }
      });
      params.confField = JSON.stringify(res);
    }
  }
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
const consoleChild = (child: any) => {
  console.log("consoleChild", child);
};
const submitEditChildNode = (child: any) => {
  let params = <any>{
    appId,
    baseId,
    editType: 2,
    selectId: child.showConf.nodeId,
  };
  if (child.showConf.confField) params.confField = child.showConf.confField;
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
        padding-top: 8px;
        padding-bottom: 8px;
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
    width: 120px;
    height: 200px;
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
      &-and {
        box-sizing: border-box;
        border: 1px solid #f38f8c;
        width: 16px;
        height: 16px;
        background-color: #f7b7b5;
        transform: translateX(2px) rotate(45deg);
      }
      &-true {
        box-sizing: border-box;
        border: 1px solid #f79d69;
        width: 16px;
        height: 16px;
        background-color: #ffbc95;
        transform: translateX(2px) rotate(45deg);
      }
      &-all {
        box-sizing: border-box;
        border: 1px solid #2ab5c9;
        width: 20px;
        height: 20px;
        background-color: #aee8f8;
      }
      &-any {
        position: relative;
        box-sizing: border-box;
        border: 20px solid #91d9ba;
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
          border: 18px solid #c3ffb8;
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
// 节点操作区
.operation-container {
  overflow: auto;
  position: absolute;
  left: -300px;
  top: -100px;
  z-index: 100;
  padding: 5px;
  border-radius: 5px;
  width: 150px;
  max-height: 600px;
  background: #ffffff;
  white-space: pre;
  .operation-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    cursor: pointer;
    font-size: 14px;
    color: #333333;
    &:hover {
      background: #ccccff;
    }
  }
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
