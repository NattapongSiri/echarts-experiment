import React, {useMemo, useState} from 'react'
import ReactECharts from 'echarts-for-react'

export default function AnnotatableChart({series, annotatingIndex, annotatingType = 'line', annotationLabel = "", axisSpacing = -15, placeText, onAnnotationDraw, onTextPlaced}) {
  if (series.length < 1) throw new Error("Series must have length greater than 0")
  const [firstDataPoint, setFirstDataPoint] = useState(undefined)
  const [annotations, setAnnotations] = useState([])
  const yAxis = useMemo(() => {
    return Object.keys(series).slice(1).map((_, index) => {
      return {
        offset: axisSpacing * index,
        triggerEvent: true
      }
    })
  }, [
    axisSpacing,
    series
  ])
  const seriesConfig = useMemo(() => {
    return [
      ...Object.keys(series).slice(1).map((_, index) => {
        return {
          emphasis: {
            disabled: false,
            focus: 'series'
          },
          type: 'line',
          yAxisIndex: index
        }
      }),
      ...annotations.map(({seriesIndex, coord, from, to, type, value}) => {
        if (type === 'line')
          return {
            type: 'line',
            yAxisIndex: seriesIndex,
            data: [
              from, 
              to
            ],
            draggable: true
          }
        else if (type === 'text') {
          return {
            type: 'custom',
            yAxisIndex: seriesIndex,
            renderItem(params, api) {
              let [x, y] = api.coord(coord)
              return {
                type: 'text',
                x,
                y,
                style: {
                  text: value,
                  fontSize: 24,
                  fill: "black",
                  stroke: "black",
                  lineWidth: 1
                },
                draggable: true,
                textConfig: {
                  local: true
                }
              }
            }
          }
        } else {
          throw new Error("Not support annotation type")
        }
      })
    ]
  }, [
    annotations, series
  ])
  return <ReactECharts 
    option={{
      dataset: {
        source: series
      },
      dataZoom: [{
        xAxisIndex: 0
      }],
      xAxis: {
        type: 'category'
      },
      yAxis,
      series: seriesConfig,
      legend: {
        show: true
      }
    }}
    onChartReady={chart => {
      chart.getZr().on('click', (params) => {
        if (annotatingIndex !== -1) {
          let [x, y] = chart.convertFromPixel({
            seriesIndex: annotatingIndex,
          }, [params.event.offsetX, params.event.offsetY])
          if (placeText !== undefined) {
            setAnnotations([...annotations, {seriesIndex: annotatingIndex, coord: [x, y], value: placeText, type: annotatingType}])
            if (typeof onTextPlaced === "function") {
              onTextPlaced([x, y], placeText)
            }
          } else if (firstDataPoint === undefined) {
            setTimeout(() => setFirstDataPoint([x, y]), 0)
          } else {
            setTimeout(() => {
              if (typeof onAnnotationDraw === "function") {
                onAnnotationDraw(firstDataPoint, [x, y])
              }
              setAnnotations([...annotations, {seriesIndex: annotatingIndex, from: firstDataPoint, to: [x, y], type: annotatingType, label: annotationLabel}])
              setFirstDataPoint(undefined)
            }, 0)
          }
        } else {
          setFirstDataPoint(undefined)
        }
      })
    }}
    onEvents = {{
      'click': (params) => {
        // console.log(params)
      },
      'mouseover': (params) => {
        console.log(params)
      }
    }}
  />
}