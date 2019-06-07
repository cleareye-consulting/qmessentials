<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    //TODO: definitely move this to a utility method, because it's duplicated from TestPlanController and TestRunController
    private function reconstruct_criteria($min_value, $is_min_value_inclusive, $max_value, $is_max_value_inclusive) {
        if ($min_value != '') {
            if ($max_value != '') {
                if ($min_value == $max_value) {
                    return $min_value;
                }
                else {
                    return ($is_min_value_inclusive ? '[' : '(') . $min_value . '..' . $max_value . ($is_max_value_inclusive ? ']' : ')');
                }
            }            
            else {
                return '>' . ($is_min_value_inclusive ? '=' : '') . $min_value;
            }
        }
        else {
            if ($max_value != '') {
                return '<' . ($is_max_value_inclusive ? '=' : '') . $max_value;
            }
        }
        return '';
    }

    public function resultsByLot($lot_id = NULL) {
        $results = NULL;
        $lots = DB::table('lots')->select('lot_id','lot_number')->get();
        if (!is_null($lot_id)) {
            $lot = DB::table('lots')->where('lot_id', $lot_id)->first();
            $items = DB::table('items')->where('lot_id', $lot_id)->get();
            $product = DB::table('products')->where('product_id', $lot->product_id)->first();
            $metrics = 
                DB::table('product_test_plans')
                ->join('test_plans','test_plans.test_plan_id','=','product_test_plans.test_plan_id')
                ->join('test_plan_metrics','test_plan_metrics.test_plan_id','=','test_plans.test_plan_id')
                ->join('metrics','metric.metric_id','=','test_plan_metric.metric_id')
                ->where([['product_test_plans.product_id',$lot->product_id],['test_plan_metric.is_active',true]])
                ->select('test_plan_metrics.test_plan_metric_id', 'metric.metric_name','test_plan_metric.qualifier','test_plan_metric.unit',
                    'test_plan_metric.is_nullable', 'test_plan_metric.min_value', 'test_plan_metric.is_min_value_inclusive',
                    'test_plan_metric.max_value','test_plan_metric.is_max_value_inclusive')
                ->get();            
            $observations = 
                DB::table('item')
                    ->join('test_run','item.item_id','=','test_run.item_id')
                    ->join('observation','test_run.test_run_id','=','observation.test_run_id')
                    ->join('observation_result','observation.observation_id','=','observation_result.observation_id')
                    ->where('item.lot_id',$lot_id)
                    ->groupBy('observation.test_plan_metric_id','observation.observation_id')
                    ->select('observation.test_plan_metric_id','observation.observation_id', DB::raw('avg(observation_result.result_value) as avg'))                    
                    ->get();
            $records = [];
            foreach ($metrics as $metric) {
                $min = NULL;
                $max = NULL;
                $count = 0;
                $sum = 0;
                foreach ($observations as $observation) {
                    if ($observation->test_plan_metric_id == $metric->test_plan_metric_id) {
                        $val = $observation->avg;
                        if (is_null($min) || $val < $min) {
                            $min = $val;
                        }
                        if (is_null($max) || $val > $max) {
                            $max = $val;
                        }
                        $count += 1;
                        $sum += $val;                
                    }
                }
                array_push(
                    $records, (object) [
                        'metric' => $metric->metric_name . (!is_null($metric->qualifier) ? (' (' . $metric->qualifier . ')' ) : ''),
                        'unit' => $metric->unit,
                        'criteria' => $this->reconstruct_criteria($metric->min_value, $metric->is_min_value_inclusive, $metric->max_value, $metric->is_max_value_inclusive),
                        'min' => $min,
                        'max' => $max,
                        'range' => (!(is_null($max) || is_null($min)) ? $max - $min : NULL),
                        'count' => $count,
                        'average' => ($count > 0 ? ($sum / $count) : NULL)
                    ]);
            }
            Log::debug('Records count: ' . count($records));
            $results = (object) [
                'records' => $records
            ];           
        }
        return view('reports/results-by-lot', ['lot_id' => $lot_id, 'lots' => $lots, 'results' => $results]);
    }
}
