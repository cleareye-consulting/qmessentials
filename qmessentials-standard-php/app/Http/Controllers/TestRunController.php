<?php

namespace App\Http\Controllers;

use App\TestRun;
use App\Observation;
use App\ObservationResult;
use App\Lot;
use App\Item;
use App\TestPlan;
use App\TestPlanMetric;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class TestRunController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $test_runs = TestRun::join('item', 'test_run.item_id', '=', 'item.item_id')
            ->join('lot', 'item.lot_id', '=', 'lot.lot_id')
            ->join('product', 'lot.product_id', '=', 'product.product_id')
            ->join('test_plan', 'test_run.test_plan_id', '=', 'test_plan.test_plan_id')
            ->select('test_run.test_run_id','test_run.created_date', 'test_plan.test_plan_name', 'item.item_number','lot.lot_number','product.product_name')
            ->get();
        return view('test-runs/test-runs', ['test_runs' => $test_runs]);
    }

    public function getItemsForLot($lot_id) {
        $items = Item::where('lot_id', $lot_id)->get();
        return response()->json($items);
    }

    public function getTestPlansForItem($item_id) {
        $test_plans = Item::join('lot', 'item.lot_id', '=', 'lot.lot_id')
            ->join('product', 'lot.product_id', '=', 'product.product_id')
            ->join('product_test_plan', 'product.product_id', '=', 'product_test_plan.product_id')
            ->join('test_plan', 'product_test_plan.test_plan_id', '=', 'test_plan.test_plan_id')
            ->where('item.item_id', $item_id)
            ->select('test_plan.test_plan_id','test_plan.test_plan_name')
            ->get();
        return response()->json($test_plans);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $lots = Lot::all();
        return view('test-runs/create-test-run', ['lots' => $lots]);
    }

    private function is_observation_needed($sequence_number, $item_count, $usage_code) {
        if ($usage_code == '' || is_null($usage_code)) {
            return true;
        }
        if ($usage_code == 'Any') {
            return true;
        }
        if ($usage_code == 'All') {
            return true;
        }
        if ($usage_code == '1/L') {
            return true;
        }
        if (preg_match('/^(?<beginning>B)?(?<frequency>\d+)?(?<end>E)?$/', $usage_code, $matches)) {
            if (array_key_exists('beginning', $matches) && $matches['beginning'] == 'B' && $sequence_number == 1) {
                return true;
            }
            if (array_key_exists('end', $matches) && $matches['end'] == 'E' && $sequence_number == $item_count) {
                return true;
            }
            if (!array_key_exists('frequency', $matches)) {
                return false;
            }
            if ($matches['frequency'] == '') {
                return false;
            }
            if ($sequence_number % intval($matches['frequency']) == 0) {
                return true;
            }
            return false;
        }
        return true;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $item_id = $request->input('item_id');
        $test_plan_id = $request->input('test_plan_id');
        $item = Item::find($item_id);
        $item_count_for_lot = Item::where('lot_id', $item->lot_id)->count();
        $item_sequence_number = (Item::where([['lot_id', $item->lot_id],['created_at', '<', $item->created_at]])->count() ?? 0) + 1;        
        DB::transaction(function() use ($item_id, $test_plan_id, $item_count_for_lot, $item_sequence_number) {
            $testRun = new TestRun;
            $testRun->item_id = $item_id;
            $testRun->test_plan_id = $test_plan_id;
            $testRun->save();
            $test_plan_metrics = TestPlanMetric::where('test_plan_id', $test_plan_id)
                ->orderby('sort_order')
                ->select('test_plan_metric_id','metric_id', 'usage_code', 'min_value', 'is_min_value_inclusive', 'max_value', 'is_max_value_inclusive', 'is_nullable')
                ->get();
            foreach ($test_plan_metrics as $test_plan_metric) {
                if ($this->is_observation_needed($item_sequence_number, $item_count_for_lot, $test_plan_metric->usage_code)) {
                    $observation = new Observation;
                    $observation->test_run_id = $test_run_id;
                    $observation->test_plan_metric_id = $test_plan_metric->test_plan_metric_id;
                    $observation->min_value = $test_plan_metric->min_value;
                    $observation->is_min_value_inclusive = $test_plan_metric->is_min_value_inclusive;
                    $observation->max_value = $test_plan_metric->max_value;
                    $observation->is_max_value_inclusive = $test_plan_metric->is_max_value_inclusive;
                    $observation->is_nullable = $test_plan_metric->is_nullable;
                    $observation->save();
                }
            }

        });
        
        return redirect()->action('TestRunController@index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $test_run = 
            TestRun::join('item', 'item.item_id', '=', 'test_run.item_id')
            ->join('lot', 'lot.lot_id', '=', 'item.lot_id')
            ->join('test_plan', 'test_plan.test_plan_id', '=', 'test_run.test_plan_id')
            ->where('test_run.test_run_id', $id)
            ->select('test_run.test_run_id', 'lot.lot_number', 'item.item_number', 'test_plan.test_plan_name')
            ->first();
        $observations = array_map(
            function($item) {
                return (object) [
                    'observation_id' => $item->observation_id,
                    'metric_id' => $item->metric_id,
                    'metric_name' => $item->metric_name,
                    'qualifier' => $item->qualifier,
                    'unit' => $item->unit,
                    'has_multiple_results' => $item->has_multiple_results,
                    'is_nullable' => $item->is_nullable,
                    'min_value' => $item->min_value,
                    'is_min_value_inclusive' => $item->is_min_value_inclusive,
                    'max_value' => $item->max_value,
                    'is_max_value_inclusive' => $item->is_max_value_inclusive,
                    'criteria' => $item->reconstructCriteria(),
                    'result_values' => []
                ];
            },
            Observation::join('test_run', 'test_run.test_run_id', '=', 'observation.test_run_id')
                ->join('test_plan_metric','test_plan_metric.test_plan_metric_id','=','observation.test_plan_metric_id')
                ->join('metric', 'metric.metric_id', '=', 'test_plan_metric.metric_id')
                ->where('observation.test_run_id', $id)
                ->select('observation.observation_id','metric.metric_id', 'metric.metric_name', 'test_plan_metric.qualifier', 'test_plan_metric.unit', 
                    'metric.has_multiple_results', 'observation.min_value', 'observation.is_min_value_inclusive', 'observation.max_value',
                    'observation.is_max_value_inclusive', 'observation.is_nullable')
                ->get()
                ->toArray()
        );            
        $observation_results = 
            Observation::join('observation_result', 'observation_result.observation_id', '=', 'observation.observation_id')
            ->where('observation.test_run_id', $id)
            ->select('observation_result.observation_id','observation_result.result_value')
            ->get();
        foreach ($observation_results as $observation_result) {
            foreach ($observations as $observation) {
                if ($observation->observation_id == $observation_result->observation_id) {
                    array_push($observation->result_values, $observation_result->result_value);
                }
            }
        }
        return view('test-runs/edit-test-run', ['test_run' => $test_run, 'observations' => $observations]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        if (Gate::denies('write-observation')) {
            return redirect()->action('TestRunController@index');
        }
        $observation_ids = Observation::where('test_run_id', $id)->pluck('observation_id');
        $observation_result_ids = 
            Observation::join('observation_result','observation_result.observation_id','=','observation.observation_id')
            ->where('observation.test_run_id',$id)
            ->pluck('observation_result.observation_result_id');
        DB::transaction(function() use ($observation_ids, $observation_result_ids, $request) {
            ObservationResult::whereIn('observation_result_id', $observation_result_ids)->delete();
            foreach($observation_ids as $observation_id) {                
                $values = explode(' ', $request->input('observation-results-' . $observation_id));                
                foreach ($values as $value) {
                    if ($value == '') {
                        continue;
                    }
                    $observationResult = new ObservationResult;
                    $observationResult->observation_id = $observation_id;
                    $observationResult->result_alue = $value;
                    $observationResult->save();
                }
            }
        });        
        return redirect()->action('TestRunController@index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
