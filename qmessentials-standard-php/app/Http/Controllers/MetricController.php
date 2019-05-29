<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MetricController extends Controller
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
        $metrics = DB::table('metric')->get();
        return view('metrics/metrics', ['metrics' => $metrics]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {        
        return view('metrics/create-metric');
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
            'is_active' => true,
            'has_multiple_results' => ($request->input('has_multiple_results') == 'on')
            ]);        
        $sortOrder = 1;
        $availableUnits = 
            array_map(
                function($item) use ($metric_id, &$sortOrder) {
                    return [
                        'metric_id' => $metric_id,                         
                        'unit' => $item,
                        'sort_order' => $sortOrder++
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_units'), -1, PREG_SPLIT_NO_EMPTY));        
        DB::table('metric_available_unit')->insert($availableUnits);
        $sortOrder = 1;
        $availableQualifiers = 
            array_map(
                function($item) use ($metric_id, &$sortOrder) {
                    return [
                        'metric_id' => $metric_id, 
                        'qualifier' => $item,
                        'sort_order' => $sortOrder++
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_qualifiers'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_qualifier')->insert($availableQualifiers);
        $sortOrder = 1;
        $industryStandards = 
            array_map(
                function($item) use ($metric_id, &$sortOrder) {
                    return [
                        'metric_id' => $metric_id, 
                        'industry_standard' => rtrim($item),
                        'sort_order' => $sortOrder++
                    ];
                }, 
                preg_split('/[\n]+/', $request->input('industry_standards'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_industry_standard')->insert($industryStandards);
        $sortOrder = 1;
        $methodologyReferences = 
            array_map(
                function($item) use ($metric_id, &$sortOrder) {
                    return [
                        'metric_id' => $metric_id, 
                        'methodology_reference' => rtrim($item),
                        'sort_order' => $sortOrder++
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

    public function getAvailableQualifiers($metric_id) {
        $availableQualifiers = array_map(
            function($item) {
                return $item->qualifier;
            },
            DB::table('metric_available_qualifier')->select('qualifier')->where('metric_id', $metric_id)->orderBy('sort_order')->get()->toArray());
        return response()->json($availableQualifiers);
    }

    public function getAvailableUnits($metric_id) {
        $availableUnits = array_map(
            function($item) {
                return $item->unit;
            },
            DB::table('metric_available_unit')->select('unit')->where('metric_id', $metric_id)->orderBy('sort_order')->get()->toArray());
        return response()->json($availableUnits);
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
            DB::table('metric_available_qualifier')->select('qualifier')->where('metric_id', $id)->orderBy('sort_order')->get()->toArray());
        $availableUnits = array_map(
            function($item) {
                return $item->unit;
            },
            DB::table('metric_available_unit')->select('unit')->where('metric_id', $id)->orderBy('sort_order')->get()->toArray());
        $industryStandards = 
            array_map(
                function($item) {
                    return $item->industry_standard;
                },
                DB::table('metric_industry_standard')->select('industry_standard')->where('metric_id', $id)->orderBy('sort_order')->get()->toArray()
            );        
        $methodologyReferences = 
            array_map(
                function($item) {
                    return $item->methodology_reference;
                },
                DB::table('metric_methodology_reference')->select('methodology_reference')->where('metric_id', $id)->orderBy('sort_order')->get()->toArray()
            );
        $model = [
            'metric_id' => $metric->metric_id,
            'metric_name' => $metric->metric_name,
            'has_multiple_results' => $metric->has_multiple_results,
            'available_qualifiers' => $availableQualifiers,
            'available_units' => $availableUnits,
            'industry_standards' => $industryStandards,
            'methodology_references' => $methodologyReferences,
            'is_active' => $metric->is_active
        ];
        return view('metrics/edit-metric', ['metric' => (object)$model]);
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
        $sortOrder = 1;
        $availableUnits = 
            array_map(
                function($item) use ($id, &$sortOrder) {
                    return [
                        'metric_id' => $id, 
                        'unit' => $item,
                        'sort_order' => $sortOrder++
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_units'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_unit')->insert($availableUnits);
        $sortOrder = 1;
        $availableQualifiers = 
            array_map(
                function($item) use ($id, &$sortOrder) {
                    return [
                        'metric_id' => $id, 
                        'qualifier' => $item,
                        'sort_order' => $sortOrder++
                    ];
                }, 
                preg_split('/[,\s]+/', $request->input('available_qualifiers'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_available_qualifier')->insert($availableQualifiers);
        $sortOrder = 1;
        $industryStandards = 
            array_map(
                function($item) use ($id, &$sortOrder) {
                    return [
                        'metric_id' => $id, 
                        'industry_standard' => rtrim($item),
                        'sort_order' => $sortOrder++
                    ];
                }, 
                preg_split('/[\n]+/', $request->input('industry_standards'), -1, PREG_SPLIT_NO_EMPTY));
        DB::table('metric_industry_standard')->insert($industryStandards);
        $sortOrder = 1;
        $methodologyReferences = 
            array_map(
                function($item) use ($id, &$sortOrder) {
                    return [
                        'metric_id' => $id, 
                        'methodology_reference' => rtrim($item),
                        'sort_order' => $sortOrder++
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
