<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestPlanMetricController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
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
        $test_plan_metric = DB::table('test_plan_metric')->where('test_plan_metric_id', $id)->first();
        $test_plan_name = DB::table('test_plan')->where('test_plan_id', $test_plan_metric->test_plan_id)->select('test_plan_name')->first()->value('test_plan_name');
        $available_qualifiers = DB::table('metric_available_qualifier')->where('metric_id', $test_plan_metric->metric_id)->orderby('sort_order')->select('qualifier')->get();
        $available_units = DB::table('metric_available_unit')->where('metric_id', $test_plan_metric->metric_id)->orderby('sort_order')->select('unit')->get();
        return view(
            'edit-test-plan-metric', [
                'test-plan-metric'=>$test_plan_metric, 
                'test_plan_name'=>$test_plan_name, 
                'available_qualifiers'=>$available_qualifiers,
                'available_units'=>$available_units,
                ]
            );
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
        DB::table('test_plan_metric')
            ->where('test_plan_metric_id', $id)
            ->update([
                'sort_order', $request->input('sort_order'),
                'qualifier', $request->input('qualifier'),                
                'is_for_each', $request->input('is_for_each'),
                'is_for_first', $request->input(''),
                'is_for_last', $request->input(''),
                'is_one_per_lot', $request->input(''),
                'frequency', $request->input(''),
                'is_nullable', $request->input(''),
                'min_value', $request->input(''),
                'is_min_value_inclusive', $request->input(''),
                'max_value', $request->input(''),
                'is_max_value_inclusive', $request->input(''),
                'is_active', $request->input('')
            ]);
        return redirect('/test-plans/' + $request->input('test_plan_id') + '/edit');
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
