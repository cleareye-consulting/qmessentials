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

    public function resultsByLot($lot_id = NULL) {
        $results = NULL;
        $lots = \App\Lot::all();
        if (!is_null($lot_id)) {            
            $lot = \App\Lot::find($lot_id);
            $testPlanMetrics = [];
            //There just has to be a better way to do this...
            foreach ($lot->product->productTestPlans()->get() as $productTestPlan) {
                foreach ($productTestPlan->testPlan->testPlanMetrics()->get() as $testPlanMetricToAdd) {
                    $found = false;
                    foreach ($testPlanMetrics as $testPlanMetricExisting) {
                        if ($testPlanMetricToAdd->id == $testPlanMetricExisting->id) {
                            $found = true;
                            break;
                        }
                    }
                    if (!$found) {
                        array_push($testPlanMetrics, $testPlanMetricToAdd);
                    }
                }
            }
            $records = [];
            foreach ($testPlanMetrics as $testPlanMetric) {
                $min = NULL;
                $max = NULL;
                $count = 0;
                $sum = 0;
                foreach ($testPlanMetric->observations()->get() as $observation) {
                    $val = $observation->observationResults()->get()->map(function($or) {return $or->result_value;})->average();
                    if (is_null($min) || $val < $min) {
                        $min = $val;
                    }
                    if (is_null($max) || $val > $max) {
                        $max = $val;
                    }
                    $count += 1;
                    $sum += $val;                
                }
                array_push(
                    $records, (object) [
                        'metric' => $testPlanMetric->metric->metric_name . (!is_null($testPlanMetric->qualifier) ? (' (' . $testPlanMetric->qualifier . ')' ) : ''),
                        'unit' => $testPlanMetric->unit,
                        'criteria' => \App\TestPlanMetric::reconstructCriteria($testPlanMetric->min_value, $testPlanMetric->is_min_value_inclusive, $testPlanMetric->max_value, $testPlanMetric->is_max_value_inclusive),
                        'min' => $min,
                        'max' => $max,
                        'range' => (!(is_null($max) || is_null($min)) ? $max - $min : NULL),
                        'count' => $count,
                        'average' => ($count > 0 ? ($sum / $count) : NULL)
                    ]);
            }
            $results = (object) [
                'records' => $records
            ];           
        }
        return view('reports/results-by-lot', ['lot_id' => $lot_id, 'lots' => $lots, 'results' => $results]);
    }
}
