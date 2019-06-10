<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;

class TestPlanController extends Controller
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
        $test_plans = \App\TestPlan::all();
        return view('test-plans/test-plans', ['test_plans' => $test_plans]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if (Gate::denies('write-test-plan')) {
            return redirect()->action('TestPlanController@index');
        }
        return view(
            'test-plans/create-test-plan', 
            ['existing_test_plans'=>\App\TestPlan::all()]
        );
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        if (Gate::denies('write-test-plan')) {
            return redirect()->action('TestPlanController@index');
        }
        DB::transaction(function() use ($request) {
            $testPlan = new \App\TestPlan;
            $testPlan->test_plan_name = $request->test_plan_name;
            $testPlan->save();
            if (!is_null($request->duplicate_of_plan_id)) {
                $originalMetrics =  \App\TestPlanMetric::where('test_plan_id', $duplicate_of_plan_id)->get();    
                foreach($originalMetrics as $originalMetric) {
                    $duplicateMetric = new \App\TestPlanMetric;
                    $duplicateMetric->test_plan_id = $testPlan->id;
                    $duplicateMetric->metric_id = $original_metric->metric_id;
                    $duplicateMetric->sort_order = $original_metric->sort_order;
                    $duplicateMetric->unit = $original_metric->unit;
                    $duplicateMetric->usage_code = $original_metric->usage_code;
                    $duplicateMetric->qualifier = $original_metric->qualifier;
                    $duplicateMetric->is_nullable = $original_metric->is_nullable;
                    $duplicateMetric->min_value = $original_metric->min_value;
                    $duplicateMetric->is_min_value_inclusive = $original_metric->is_min_value_inclusive;
                    $duplicateMetric->max_value = $original_metric->max_value;
                    $duplicateMetric->is_max_value_inclusive = $original_metric->is_max_value_inclusive;
                    $duplicateMetric->save();
                }
            }
        });
        return redirect('/test-plans');
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
    public function edit($id, $test_plan_metric_id_under_edit = NULL)
    {
        if (Gate::denies('write-test-plan')) {
            return redirect()->action('TestPlanController@index');
        }
        $test_plan = \App\TestPlan::find($id);
        $test_plan_metrics = array_map(            
            function($tpm) {
                return (object) [
                    'id' => $tpm->id,
                    'metric_id' => $tpm->metric_id,
                    'metric_name' => $tpm->metric_name,
                    'test_plan_id' => $tpm->test_plan_id,
                    'sort_order' => $tpm->sort_order,
                    'qualifier' => $tpm->qualifier,
                    'unit' => $tpm->unit,
                    'usage_code' => $tpm->usage_code,
                    'criteria' => \App\TestPlanMetric::reconstructCriteria($tpm->min_value, $tpm->is_min_value_inclusive, $tpm->max_value, $tpm->is_max_value_inclusive),
                    'is_nullable' => $tpm->is_nullable
                ];
            },
            DB::table('test_plan_metrics')
                ->join('metrics', 'test_plan_metrics.metric_id', '=', 'metrics.id')
                ->where([['test_plan_metrics.test_plan_id', $id],['test_plan_metrics.deleted_at',NULL]])
                ->select(['test_plan_metrics.test_plan_id','test_plan_metrics.id','test_plan_metrics.metric_id',
                    'metrics.metric_name','test_plan_metrics.sort_order','test_plan_metrics.qualifier','test_plan_metrics.unit',
                    'test_plan_metrics.usage_code','test_plan_metrics.min_value','test_plan_metrics.is_min_value_inclusive',
                    'test_plan_metrics.max_value','test_plan_metrics.is_max_value_inclusive','test_plan_metrics.is_nullable'])
                ->orderby('test_plan_metrics.sort_order')
                ->get()
                ->toArray()
        );
        $availableQualifiersForEdit = NULL;
        $availableUnitsForEdit = NULL;
        $metrics = \App\Metric::all();
        if (!is_null($test_plan_metric_id_under_edit)) {
            $metric_id = \App\TestPlanMetric::where('id',$test_plan_metric_id_under_edit)->value('metric_id');
            $availableQualifiersForEdit = \App\MetricAvailableQualifier::where('metric_id', $metric_id)->orderBy('sort_order')->pluck('qualifier')->toArray();
            $availableUnitsForEdit = \App\MetricAvailableUnit::where('metric_id', $metric_id)->orderBy('sort_order')->pluck('unit')->toArray();
        }
        return view('test-plans/edit-test-plan', 
            [
                'test_plan' => $test_plan, 
                'test_plan_metrics' => $test_plan_metrics,
                'metrics' => $metrics,
                'test_plan_metric_id_under_edit' => $test_plan_metric_id_under_edit,
                'available_qualifiers_for_edit' => $availableQualifiersForEdit,
                'available_units_for_edit' => $availableUnitsForEdit
            ]
        );
    }

    private function parse_criteria(string $range) {
        if (preg_match('/^(?<operator>>|>=|<=|<|=)?\s*(?<value>[\d\.,]+)$/', $range, $matches)) {
            if ($matches['operator'] == '' || $matches['operator'] == '=') {
                return ['min_value' => floatval($matches['value']), 'is_min_value_inclusive' => true,  'max_value' => floatval($matches['value']), 'is_max_value_inclusive' => true];
            }
            if ($matches['operator'] == '<') {
                return ['min_value' => null, 'is_min_value_inclusive' => null,  'max_value' => floatval($matches['value']), 'is_max_value_inclusive' => false];
            }
            if ($matches['operator'] == '<=') {
                return ['min_value' => null, 'is_min_value_inclusive' => null,  'max_value' => floatval($matches['value']), 'is_max_value_inclusive' => true];
            }
            if ($matches['operator'] == '>') {
                return ['min_value' => floatval($matches['value']), 'is_min_value_inclusive' => false,  'max_value' => null, 'is_max_value_inclusive' => null];
            }
            if ($matches['operator'] == '>=') {
                return ['min_value' => floatval($matches['value']), 'is_min_value_inclusive' => true,  'max_value' => null, 'is_max_value_inclusive' => null];
            }        
        }
        else if (preg_match('/^(?<opener>[\[\(])?(?<min>[\d\.,]+)?\s*(?:-|(?:\.\.\.?))\s*(?<max>[\d\.,]+)?(?<closer>\]|\))?$/', $range, $matches)) {
            return [
                'min_value' => (is_null($matches['min']) ? null : floatval($matches['min'])),
                'is_min_value_inclusive' => $matches['opener'] != '(',
                'max_value' => (is_null($matches['max']) ? null : floatval($matches['max'])),
                'is_max_value_inclusive' => array_key_exists('closer',$matches) ? $matches['closer'] != ')' : true
            ];
        }
        return ['min_value' => null, 'is_min_value_inclusive' => null,  'max_value' => null, 'is_max_value_inclusive' => null];
    }

    private function renumber_test_plan_metrics($test_plan_id, $new_number, $new_number_holder) {
        $number_holder_count = 
            \App\TestPlanMetric::where([['test_plan_id', $test_plan_id],['sort_order', $new_number]])->count();
        if ($number_holder_count == 1) {            
            return; //no need to do anything because number was already vacant
        }
        \App\TestPlanMetric::where([['test_plan_id', $test_plan_id],['sort_order', '>=' , $new_number],['id', '!=', $new_number_holder]])
            ->update(['sort_order' => DB::raw('sort_order + 1')]);
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
        if (Gate::denies('write-test-plan')) {
            return redirect()->action('TestPlanController@index');
        }
        if ($request->input('new_metric_id') != 0) {            
            $criteria = $this->parse_criteria($request->new_metric_criteria ?? 'Any');
            $newTestPlanMetric = new \App\TestPlanMetric;
            $newTestPlanMetric->test_plan_id = $request->test_plan_id;
            $newTestPlanMetric->metric_id = $request->new_metric_id;
            $newTestPlanMetric->sort_order = $request->new_metric_sort_order;
            $newTestPlanMetric->qualifier = $request->new_metric_qualifier;              
            $newTestPlanMetric->usage_code = $request->new_metric_usage_code;
            $newTestPlanMetric->unit = $request->new_metric_unit;
            $newTestPlanMetric->is_nullable = $request->new_metric_is_nullable == 'on';                    
            $newTestPlanMetric->min_value = $criteria['min_value'];
            $newTestPlanMetric->is_min_value_inclusive = $criteria['is_min_value_inclusive'];
            $newTestPlanMetric->max_value =  $criteria['max_value'];
            $newTestPlanMetric->is_max_value_inclusive = $criteria['is_max_value_inclusive'];
            $newTestPlanMetric->save();
            $this->renumber_test_plan_metrics($request->test_plan_id, $request->new_metric_sort_order, $newTestPlanMetric->id);
            return redirect()->action('TestPlanController@edit', ['id' => $id]);
        }
        else if ($request->test_plan_metric_id_under_edit != '') {
            $criteria = $this->parse_criteria($request->edited_metric_criteria ?? 'Any');
            $editedTestPlanMetric = \App\TestPlanMetric::find($request->test_plan_metric_id_under_edit);
            $editedTestPlanMetric->sort_order = $request->edited_metric_sort_order;
            $editedTestPlanMetric->qualifier = $request->edited_metric_qualifier;              
            $editedTestPlanMetric->usage_code = $request->edited_metric_usage_code;
            $editedTestPlanMetric->unit = $request->edited_metric_unit;
            $editedTestPlanMetric->is_nullable = $request->edited_metric_is_nullable == 'on';                    
            $editedTestPlanMetric->min_value = $criteria['min_value'];
            $editedTestPlanMetric->is_min_value_inclusive = $criteria['is_min_value_inclusive'];
            $editedTestPlanMetric->max_value =  $criteria['max_value'];
            $editedTestPlanMetric->is_max_value_inclusive = $criteria['is_max_value_inclusive'];
            $editedTestPlanMetric->save();
            $this->renumber_test_plan_metrics($request->test_plan_id, $request->edited_metric_sort_order, $request->test_plan_metric_id_under_edit);
            return redirect()->action('TestPlanController@edit', ['id' => $id]);
        }
        else if ($request->test_plan_metric_id_to_delete != '') {
            \App\TestPlanMetric::destroy($request->test_plan_metric_id_to_delete);
            return redirect()->action('TestPlanController@edit', ['id' => $id]);
        }
        return redirect()->action('TestPlanController@index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        TestPlan::destroy($id);
    }
}
