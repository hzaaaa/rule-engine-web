import { Stencil, } from '@antv/x6-plugin-stencil';
import { Dnd } from "@antv/x6-plugin-dnd";
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history';
import { MiniMap } from "@antv/x6-plugin-minimap";
import { Graph, Node } from "@antv/x6";
import { ElMessage } from "element-plus";
import { Scroller } from '@antv/x6-plugin-scroller'

export default (graph: any) => {
    // #region 使用插件
    // graph.disposePlugins('minimap')
    // debugger
    graph
        .use(
            new Transform({
                resizing: false,
                rotating: false,
            }),
        )
        .use(
            new Scroller({
                enabled: true,
                pageVisible: true,
                pageBreak: false,
                pannable: true,
            }),
        )
        .use(
            new Selection({
                enabled: false,// map待看
                rubberband: false,
                showNodeSelectionBox: true,
                // showEdgeSelectionBox: true,
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
        .use(
            new MiniMap({
                container: <HTMLElement | undefined>document.getElementById("minimap"),
            })
        );
    // #endregion

    let onlyNodeTypeList = <Array<any>>["start", "end", 1, 3];//只能出现一次的node type
    let canNotRemoveNodeTypeList = <Array<any>>["start", "end"];//无法删除的node type
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
        validateNode: (droppingNode: Node, options: Dnd.ValidateNodeOptions) => {

            let isOnly = onlyNodeTypeList.includes(droppingNode.data.type);
            if (isOnly) {

                let hadNodeList = graph.getNodes();
                hadNodeList = hadNodeList.filter((item: any) => {
                    return item.data.type === droppingNode.data.type
                })
                if (hadNodeList.length !== 0) {
                    console.log('禁止拖进画板')
                    ElMessage.info('当前组件已存在，请勿重复拖拽');

                    return false
                } else {
                    return true
                }
            } else {
                return true
            }


        }
    });
    document.getElementById("stencil")!.appendChild(stencil.container);
    // #endregion



    // #region 快捷键与事件
    // copy and paste
    graph.bindKey(["meta+c", "ctrl+c"], () => {
        let cells = graph.getSelectedCells();
        cells = cells.filter((element: any) => {
            let flag = onlyNodeTypeList.includes(element?.data?.type);
            return !flag;
        });
        if (cells.length) {
            graph.copy(cells);
        } else {
            console.log('唯一节点无法拷贝');
            ElMessage.info('唯一节点无法拷贝');
        }
    });
    graph.bindKey(["meta+x", "ctrl+x"], () => {
        // const cells = graph.getSelectedCells();
        // if (cells.length) {
        //     graph.cut(cells);
        // }
        let cells = graph.getSelectedCells();
        cells = cells.filter((element: any) => {
            let flag = onlyNodeTypeList.includes(element?.data?.type);
            return !flag;
        });
        if (cells.length) {
            graph.cut(cells);
        } else {
            console.log('唯一节点无法剪切');
            ElMessage.info('唯一节点无法剪切');
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
        // if (graph.history.canUndo()) {
        graph.undo();
        // }
    });
    graph.bindKey(["meta+shift+z", "ctrl+shift+z"], () => {
        // if (graph.history.canRedo()) {
        graph.redo();
        // }
    });

    //delete

    graph.bindKey(["delete", 'backspace'], () => {
        let cells = graph.getSelectedCells();
        if (cells.length) {
            cells = cells.filter((element: any) => {
                let flag = canNotRemoveNodeTypeList.includes(element?.data?.type);
                return !flag;
            });
            // debugger

            if (cells.length) {
                graph.removeCells(cells);
            } else {
                console.log('节点不能被删除');
                ElMessage.info('节点不能被删除');
            }
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
    // #endregion

    // #region 初始化图形
    // 连接桩
    const ports = {
        groups: { //上右下左 为 port1 port2 port3 port4
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

    // #region 自定义边 点
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

                // strokeDasharray: '5 5',//虚线
                // style: {
                //     animation: 'ant-line 30s infinite linear',//动画
                // },
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
            tools: [
                // {
                //     name: 'button-remove',
                //     args: {
                //         x: '100%',
                //         y: 0,
                //         offset: { x: -10, y: 10 },
                //     },
                // },

            ],


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
        "custom-circle-start",
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
                items: [
                    {
                        id: 'port3',
                        group: 'bottom',
                    },

                ],
            },
            label: "开始",
            data: {
                type: 'start',
                name: "开始节点",
            },

        },
        true
    );
    Graph.registerNode(
        "custom-circle-end",
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
                items: [
                    {
                        id: 'port1',
                        group: 'top',
                    },

                ],
            },
            label: "结束",
            data: {
                type: 'end',
                name: "结束节点",
            },


        },
        true
    );


    const r2 = graph.createNode({
        shape: "custom-rect",
        label: "过程1",
        data: {
            type: 1,
            name: "计算节点1",
            expression: "1",
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
            name: "计算节点2",
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
    const r4 = graph.createNode({
        shape: "custom-polygon",
        attrs: {
            body: {
                refPoints: "0,10 10,0 20,10 10,20",
            },
        },
        label: "过程3",
        data: {
            type: 3,
            name: "计算节点3",
            expression: '',
        },
    });
    const r5 = graph.createNode({
        shape: "custom-polygon",
        attrs: {
            body: {
                refPoints: "10,0 40,0 30,20 0,20",
            },
        },
        label: "其他节点",
        data: {
            type: 'other',
            name: "其他节点",
            expression: '',
        },
    });

    stencil.load([r2, r3, r4, r5,], "group1");//
    // #endregion
    // #endregion

    return {
        onlyNodeTypeList,
        canNotRemoveNodeTypeList
    }

}
export let test = () => {

}