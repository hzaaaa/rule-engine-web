import { Stencil } from '@antv/x6-plugin-stencil';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Transform } from '@antv/x6-plugin-transform'
import { Selection } from '@antv/x6-plugin-selection'
import { Snapline } from '@antv/x6-plugin-snapline'
import { Clipboard } from '@antv/x6-plugin-clipboard'
import { History } from '@antv/x6-plugin-history';
import { Graph } from "@antv/x6";

export default (graph: any) => {
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
    // #endregion

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
                {
                    name: 'button-remove',
                    args: {
                        x: '100%',
                        y: 0,
                        offset: { x: -10, y: 10 },
                    },
                },

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
    // #endregion


}
export let test = () => {

}