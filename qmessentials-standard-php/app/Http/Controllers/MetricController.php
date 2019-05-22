<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MetricController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $metrics = DB::table('metric')->get();
        return view('metrics', ['metrics' => $metrics]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {        
        return view('create-metric');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $metric_name = $request->input('metric_name');
        DB::table('metric')->insert([
            'metric_name' => $metric_name, 
            'has_multiple_results' => ($request->input('has_multiple_results') == 'on')
            ]);
        $availableUnits = 
            array_map(
                function($item) use ($metric_name) {
                    return [
                        'metric_name' => $metric_name, 
                        'unit' => $item
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_units'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_unit')->insert($availableUnits);
        $availableQualifiers = 
            array_map(
                function($item) use ($metric_name) {
                    return [
                        'metric_name' => $metric_name, 
                        'qualifier' => $item
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_qualifiers'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_qualifier')->insert($availableQualifiers);
        $industryStandards = 
            array_map(
                function($item) use ($metric_name) {
                    return [
                        'metric_name' => $metric_name, 
                        'industry_standard' => rtrim($item)
                    ];
                }, 
                preg_split('/[\n]+/', $request->input('industry_standards'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_industry_standard')->insert($industryStandards);
        $methodologyReferences = 
            array_map(
                function($item) use ($metric_name) {
                    return [
                        'metric_name' => $metric_name, 
                        'methodology_reference' => rtrim($item)
                    ];
                }, 
                preg_split('/[\n]+/', $request->input('methodology_references'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_methodology_reference')->insert($methodologyReferences);
        return redirect('/metrics');
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
        //
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
        //
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
