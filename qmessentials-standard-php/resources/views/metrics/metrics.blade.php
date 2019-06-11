@extends('layouts/app')

@section('title','Metrics')

@section('content')
    <div class="container">
        <h2 class="subtitle">Metrics</h2>  
        @can('write-metric')
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
            @foreach($metrics as $metric) 
                <tr>
                    <td><a href="/metrics/{{$metric->id}}/edit">{{$metric->metric_name}}</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/metrics/create">Add a Metric</a>
        </div>
        @endcan
        @cannot('write-metric')
        <p class="lead">You must be in role 'Analyst' to view or edit metrics.</p>
        @endcannot
    </div>
@endsection