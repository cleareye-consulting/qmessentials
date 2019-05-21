@extends('layout')

@section('title','Metrics')

@section('content')
    <h2 class="subtitle">Metrics</h2>  
    <table class="table is-bordered">
        <thead>
            <tr>
                <th>Name</th>
                <th>Multiple</th>
            </tr>
        </thead>
        <tbody>
        @foreach($metrics as $metric) 
            <tr>
                <td>{{$metric->metric_name}}</td>
                <td>{{$metric->has_multiple_results ? 'Y' : ''}}
            </tr>
        @endforeach
        </tbody>
    </table>
    <div>
        <a href="/metrics/create">Add a Metric</a>
    </div>
@endsection