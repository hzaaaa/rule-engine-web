<template>
  <div class="detail">
    <!-- 按钮区 -->
    <div class="btn">
      <el-button @click="router.back()">返回</el-button>
      <el-button type="primary" @click="release">发布</el-button>
      <el-button type="danger" @click="confUpdateClean">清除</el-button>
      <el-button @click="importJson">导入</el-button>
      <el-button @click="exportJson">导出</el-button>
    </div>
    <div id="container"></div>

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
    if (res.code === 200) ElMessage.success("success");
    else ElMessage.error(res.msg);
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
/*
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
      connector: { name: "smooth" },
    },
  ],
};
onMounted(() => {
  const graph = new Graph({
    container: document.getElementById("AntVContainer")!,
    width: 1000,
    height: 800,
  });
  graph.fromJSON(data);
});
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

let graph: any = null;
let createRoot = false;
const initTree = (treeData: any[]) => {
  if (!graph) {
    const container = document.getElementById("container");
    const width = container?.scrollWidth;
    const height = container?.scrollHeight || 500;
    graph = new G6.TreeGraph({
      container: "container",
      width,
      height,
      modes: {
        default: ["drag-canvas", "zoom-canvas"],
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
  if (type <= 4) {
    return {
      type: "circle",
      color: "#FFFACD",
      stroke: "#EEAD0E",
      size: [30, 30],
    };
  } else if (type === 5) {
    return {
      type: "diamond",
      color: "#C1FFC1",
      stroke: "#00CD00",
      size: [31, 31],
    };
  } else if (type === 6) {
    return {
      type: "rect",
      color: "#C1FFC1",
      stroke: "#00CD00",
      size: [26, 26],
    };
  } else if (type === 7) {
    return {
      type: "triangle",
      color: "#C1FFC1",
      stroke: "#00CD00",
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
    // console.log("click", ev);
    // showOperation.value = false;
    if (!ev.item || ev.item._cfg.type !== "node") showOperation.value = false;
  });
  // 监听 node 上面 mouse 事件
  graph.on("node:click", (evt: any) => {
    const { item } = evt;
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
    console.log("modal", selectedNode.value);
  });
};
const refreshGraph = () => {
  getConfDetailApi({ appId: Number(appId), baseId: Number(baseId), address: "server" }).then((res) => {
    console.log("getConfDetailApi", res.data);
    jsonToGraph(res.data);
  });
  // jsonToGraph(detailData3);
};
const jsonToGraph = (detailsData: any) => {
  if (detailsData) {
    createRoot = false;
    if (graph && graph.destroy) {
      graph.destroy();
      graph = null;
    }
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

    const treeData = {
      ...root,
      children: createTreeData(rootChildren),
    };

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
  if (showConf.value.confField) params.confField = showConf.value.confField;
  if (showConf.value.confName) params.confName = showConf.value.confName;
  if (showConf.value.nodeType) params.nodeType = showConf.value.nodeType;
  if (selectedNode.value.parentId) params.parentId = selectedNode.value.parentId;
  if (selectedNode.value.nextId) params.nextId = selectedNode.value.nextId;
  if (editNodeModalForm.name) params.name = editNodeModalForm.name;
  if (editNodeModalForm.timeType) params.timeType = editNodeModalForm.timeType;
  if (editNodeModalForm.start) params.start = dateToStr(editNodeModalForm.start);
  if (editNodeModalForm.end) params.end = dateToStr(editNodeModalForm.end);

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
    if (Object.keys(dynamicForm.value).length) params.confField = JSON.stringify(dynamicForm.value);
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
</script>

<style scoped lang="scss">
#container {
  width: 100%;
  height: 700px;
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
}
</style>
