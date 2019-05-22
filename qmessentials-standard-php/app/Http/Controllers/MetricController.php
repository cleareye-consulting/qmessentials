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
        $metric_id = DB::table('metric')->insertGetId([
            'metric_name' => $request->input('metric_name'), 
            'has_multiple_results' => ($request->input('has_multiple_results') == 'on')
            ]);
        $availableUnits = 
            array_map(
                function($item) use ($metric_id) {
                    return [
                        'metric_id' => $metric_id, 
                        'unit' => $item
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_units'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_unit')->insert($availableUnits);
        $availableQualifiers = 
            array_map(
                function($item) use ($metric_id) {
                    return [
                        'metric_id' => $metric_id, 
                        'qualifier' => $item
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_qualifiers'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_qualifier')->insert($availableQualifiers);
        $industryStandards = 
            array_map(
                function($item) use ($metric_id) {
                    return [
                        'metric_id' => $metric_id, 
                        'industry_standard' => rtrim($item)
                    ];
                }, 
                preg_split('/[\n]+/', $request->input('industry_standards'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_industry_standard')->insert($industryStandards);
        $methodologyReferences = 
            array_map(
                function($item) use ($metric_id) {
                    return [
                        'metric_id' => $metric_id, 
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
        $metric = DB::table('metric')->where('metric_id', $id)->first();
        $availableQualifiers = array_map(
            function($item) {
                return $item->qualifier;
            },
            DB::table('metric_available_qualifier')->select('qualifier')->where('metric_id', $id)->get()->toArray());
        $availableUnits = array_map(
            function($item) {
                return $item->unit;
            },
            DB::table('metric_available_unit')->select('unit')->where('metric_id', $id)->get()->toArray());
        $industryStandards = 
            array_map(
                function($item) {
                    return $item->industry_standard;
                },
                DB::table('metric_industry_standard')->select('industry_standard')->where('metric_id', $id)->get()->toArray()
            );        
        $methodologyReferences = 
            array_map(
                function($item) {
                    return $item->methodology_reference;
                },
                DB::table('metric_methodology_reference')->select('methodology_reference')->where('metric_id', $id)->get()->toArray()
            );
        $model = [
            'metric_id' => $metric->metric_id,
            'metric_name' => $metric->metric_name,
            'has_multiple_results' => $metric->has_multiple_results,
            'available_qualifiers' => $availableQualifiers,
            'available_units' => $availableUnits,
            'industry_standards' => $industryStandards,
            'methodology_references' => $methodologyReferences
        ];
        return view('edit-metric', ['metric' => (object)$model]);
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
        DB::table('metric')
            ->where('metric_id', $id)
            ->update(['has_multiple_results' => $request->input('has_multiple_results') == 'on']);
        DB::table('metric_available_qualifier')->where('metric_id', $id)->delete();
        DB::table('metric_available_unit')->where('metric_id', $id)->delete();
        DB::table('metric_industry_standard')->where('metric_id', $id)->delete();
        DB::table('metric_methodology_reference')->where('metric_id', $id)->delete();
        $availableUnits = 
            array_map(
                function($item) use ($id) {
                    return [
                        'metric_id' => $id, 
                        'unit' => $item
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_units'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_unit')->insert($availableUnits);
        $availableQualifiers = 
            array_map(
                function($item) use ($id) {
                    return [
                        'metric_id' => $id, 
                        'qualifier' => $item
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_qualifiers'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_qualifier')->insert($availableQualifiers);
        $industryStandards = 
            array_map(
                function($item) use ($id) {
                    return [
                        'metric_id' => $id, 
                        'industry_standard' => rtrim($item)
                    ];
                }, 
                preg_split('/[\n]+/', $request->input('industry_standards'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_industry_standard')->insert($industryStandards);
        $methodologyReferences = 
            array_map(
                function($item) use ($id) {
                    return [
                        'metric_id' => $id, 
                        'methodology_reference' => rtrim($item)
                    ];
                }, 
                preg_split('/[\n]+/', $request->input('methodology_references'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_methodology_reference')->insert($methodologyReferences);
        return redirect('/metrics');
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
