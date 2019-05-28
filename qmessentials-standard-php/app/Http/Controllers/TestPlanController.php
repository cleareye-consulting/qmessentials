<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $test_plans = DB::table('test_plan')->where('is_active',true)->get();
        return view('test-plans', ['test_plans' => $test_plans]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view(
            'create-test-plan', 
            ['existing_test_plans'=>DB::table('test_plan')->where('is_active',true)->select('test_plan_id','test_plan_name')->get()]
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
        $test_plan_name = $request->input('test_plan_name');
        $duplicate_of_plan_id = $request->input('duplicate_of_plan_id');
        if (!is_null($duplicate_of_plan_id)) {
            $original_metrics = DB::table('test_plan_metric')->where([['test_plan_id', $duplicate_of_plan_id],['is_active',true]])->get();
            DB::transaction(function() use ($duplicate_of_plan_id, $original_metrics, $test_plan_name)  {
                $test_plan_id = DB::table('test_plan')->insertGetId([
                    'test_plan_name' => $test_plan_name,
                    'is_active' => true
                ]);
                foreach($original_metrics as $original_metric) {
                    DB::table('test_plan_metric')->insert([
                        'test_plan_id' => $test_plan_id,
                        'metric_id' => $original_metric->metric_id,
                        'sort_order'=> $original_metric->sort_order,
                        'qualifier'=> $original_metric->qualifier,
                        'is_for_each'=> $original_metric->is_for_each,
                        'is_for_first'=> $original_metric->is_for_first,
                        'is_for_last'=> $original_metric->is_for_last,
                        'is_one_per_lot'=> $original_metric->is_one_per_lot,
                        'frequency'=> $original_metric->frequency,
                        'is_nullable'=> $original_metric->is_nullable,
                        'min_value'=> $original_metric->min_value,
                        'is_min_value_inclusive'=> $original_metric->is_min_value_inclusive,
                        'max_value'=> $original_metric->max_value,
                        'is_max_value_inclusive'=> $original_metric->is_max_value_inclusive
                    ]);
                }
            });
        }
        else {
            DB::table('test_plan')->insert([
                'test_plan_name' => $test_plan_name,
                'is_active' => true
            ]);
        }
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
        $test_plan = DB::table('test_plan')->where('test_plan_id', $id)->first();
        $test_plan_metrics = 
        array_map(            
            function($tpm) {
                return (object) [
                    'test_plan_metric_id' => $tpm->test_plan_metric_id,
                    'metric_id' => $tpm->metric_id,
                    'metric_name' => $tpm->metric_name,
                    'test_plan_id' => $tpm->test_plan_id,
                    'sort_order' => $tpm->sort_order,
                    'qualifier' => $tpm->qualifier,
                    'unit' => $tpm->unit,
                    'usage_code' => $tpm->usage_code,
                    'criteria' => $this->reconstruct_criteria((float) $tpm->min_value, (bool) $tpm->is_min_value_inclusive, (float) $tpm->max_value, (bool) $tpm->is_max_value_inclusive),
                    'is_nullable' => $tpm->is_nullable,
                    'is_active' => $tpm->is_active
                ];
            },
            DB::table('test_plan_metric')
                ->join('metric', 'test_plan_metric.metric_id', '=', 'metric.metric_id')
                ->where([['test_plan_metric.test_plan_id', $id],['test_plan_metric.is_active',true]])
                ->select(['test_plan_metric.test_plan_id', 'test_plan_metric.test_plan_metric_id', 'metric.metric_id','metric.metric_name',
                    'test_plan_metric.sort_order','test_plan_metric.qualifier','test_plan_metric.unit','test_plan_metric.usage_code',
                    'test_plan_metric.min_value','test_plan_metric.is_min_value_inclusive','test_plan_metric.max_value',
                    'test_plan_metric.is_max_value_inclusive','test_plan_metric.is_nullable','test_plan_metric.is_active'])
                ->orderby('test_plan_metric.sort_order')
                ->get()
                ->toArray()
        );
        $availableQualifiersForEdit = NULL;
        $availableUnitsForEdit = NULL;
        $metrics = DB::table('metric')->where('is_active',true)->select('metric_id', 'metric_name')->get();        
        if (!is_null($test_plan_metric_id_under_edit)) {
            $metric_id = DB::table('test_plan_metric')->where('test_plan_metric_id',$test_plan_metric_id_under_edit)->value('metric_id');
            $availableQualifiersForEdit = array_map(
                function($item) {
                    return $item->qualifier;
                },
                DB::table('metric_available_qualifier')->select('qualifier')->where('metric_id', $metric_id)->orderBy('sort_order')->get()->toArray());
            $availableUnitsForEdit = array_map(
                function($item) {
                    return $item->unit;
                },
                DB::table('metric_available_unit')->select('unit')->where('metric_id', $metric_id)->orderBy('sort_order')->get()->toArray());
        }
        return view('edit-test-plan', 
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
        if (preg_match('/^(>|>=|<=|<|=)?\s*([\d\.,])+$/', $range, $matches)) {
            if ($matches[1] == '<') {
                return ['min_value' => null, 'is_min_value_inclusive' => null,  'max_value' => floatval($matches[2]), 'is_max_value_inclusive' => false];
            }
            if ($matches[1] == '<=') {
                return ['min_value' => null, 'is_min_value_inclusive' => null,  'max_value' => floatval($matches[2]), 'is_max_value_inclusive' => true];
            }
            if ($matches[1] == '>') {
                return ['min_value' => floatval($matches[2]), 'is_min_value_inclusive' => false,  'max_value' => null, 'is_max_value_inclusive' => null];
            }
            if ($matches[1] == '>=') {
                return ['min_value' => floatval($matches[2]), 'is_min_value_inclusive' => true,  'max_value' => null, 'is_max_value_inclusive' => null];
            }        
            if ($matches[1] == '=') {
                return ['min_value' => floatval($matches[2]), 'is_min_value_inclusive' => true,  'max_value' => floatval($matches[2]), 'is_max_value_inclusive' => true];
            }
        }
        else if (preg_match('/^([\[\)])?([\d\.,]+)?\s*(\-|\.\.\.)?\s*([\d\.,]+)?(\]|\))?$/', $range, $matches)) {
            return [
                'min_value' => (is_null($matches[2]) ? null : floatval($matches[2])),
                'is_min_value_inclusive' => $matches[1] == '[',
                'max_value' => (is_null($matches[4]) ? null : floatval($matches[4])),
                'is_max_value_inclusive' => $matches[5] == ']'
            ];
        }
        return ['min_value' => null, 'is_min_value_inclusive' => null,  'max_value' => null, 'is_max_value_inclusive' => null];
    }

    private function reconstruct_criteria(float $min_value, bool $is_min_value_inclusive, float $max_value, float $is_max_value_exclusive) {
        if (!is_null($min_value)) {
            if (!is_null($max_value)) {
                if ($min_value == $max_value) {
                    return $min_value;
                }
                else {
                    return ($is_min_value_inclusive ? '[' : '(') . $min_value . '..' . $max_value . ($is_max_value_exclusive ? ']' : ')');
                }
            }            
            else {
                return '>' . ($is_min_value_inclusive ? '=' : '') . $min_value;
            }
        }
        else {
            if (!is_null($max_value)) {
                return '<' . ($is_max_value_inclusive ? '=' : '') . $max_value;
            }
        }
        return '';
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
        DB::table('test_plan')->where('test_plan_id', $request->input('test_plan_id'))->update(['is_active' => ($request->input('is_active') == 'on')]);
        if (!is_null($request->input('new_metric_id'))) {            
            $criteria = $this->parse_criteria($request->input('new_metric_criteria'));
            DB::table('test_plan_metric')
                ->insert([
                    'test_plan_id' => $request->input('test_plan_id'),
                    'metric_id' => $request->input('new_metric_id'),
                    'sort_order' => $request->input('new_metric_sort_order'),
                    'qualifier' => $request->input('new_metric_qualifier'),                
                    'usage_code' => $request->input('new_metric_usage_code'),
                    'unit' => $request->input('new_metric_unit'),
                    'is_nullable' => $request->input('new_metric_is_nullable') == 'on',
                    'min_value' => $criteria['min_value'],
                    'is_min_value_inclusive' => $criteria['is_min_value_inclusive'],
                    'max_value' =>  $criteria['max_value'],
                    'is_max_value_inclusive' => $criteria['is_max_value_inclusive'],
                    'is_active' => $request->input('new_metric_is_active') == 'on'
                ]);
            return redirect()->action('TestPlanController@edit', ['id' => $id]);
        }
        else if (!is_null($request->input('test_plan_metric_id_under_edit'))) {
            $criteria = $this->parse_criteria($request->input('edited_metric_criteria'));
            DB::table('test_plan_metric')
                ->where('test_plan_metric_id', $request->input('test_plan_metric_id_under_edit'))
                ->update([
                    'sort_order' => $request->input('edited_metric_sort_order'),
                    'qualifier' => $request->input('edited_metric_qualifier'),                
                    'usage_code' => $request->input('edited_metric_usage_code'),
                    'unit' => $request->input('edited_metric_unit'),
                    'is_nullable' => $request->input('edited_metric_is_nullable') == 'on',
                    'min_value' => $criteria['min_value'],
                    'is_min_value_inclusive' => $criteria['is_min_value_inclusive'],
                    'max_value' =>  $criteria['max_value'],
                    'is_max_value_inclusive' => $criteria['is_max_value_inclusive'],
                    'is_active' => $request->input('edited_metric_is_active') == 'on'
                ]);
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
        //
    }
}
